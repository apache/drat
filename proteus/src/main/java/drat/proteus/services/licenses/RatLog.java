/**
 * Licensed to the Apache Software Foundation (ASF) under one or more
 * contributor license agreements.  See the NOTICE file distributed with
 * this work for additional information regarding copyright ownership.
 * The ASF licenses this file to You under the Apache License, Version 2.0
 * (the "License"); you may not use this file except in compliance with
 * the License.  You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

package drat.proteus.services.licenses;

import java.io.IOException;
import java.util.HashMap;
import java.util.ArrayList;
import java.util.Map;
import java.util.logging.Logger;
import java.util.List;

public class RatLog {
  private static final Logger LOG = Logger.getLogger(RatLog.class.getName());
  private String ratLog;
  private String ratLogLink;
  private Map<String, Integer> licenseSpread;
  private List<String> unapprovedLicenseFiles;
  private boolean hasBeenParsed = false;
  private static final String SECTION_SEPARATOR = "*******";
  private static final String UNAPPROVED_LICENSES = "Unapproved licenses";
  private static List<String> LICENSE_VALUES = new ArrayList<>(); // it's a list
                                                                  // so popping
                                                                  // off the
                                                                  // element can
                                                                  // be easy
  static {
    LICENSE_VALUES.add("Notes");
    LICENSE_VALUES.add("Binaries");
    LICENSE_VALUES.add("Archives");
    LICENSE_VALUES.add("Standards");
    LICENSE_VALUES.add("Apache Licensed");
    LICENSE_VALUES.add("Generated");
  }
  private static final String UNKNOWN = "Unknown Licenses";

  public RatLog(String ratLogLink, String log) {
    this.ratLogLink = ratLogLink;
    if (log == null || 
        (log != null && log.isEmpty())){
      LOG.warning("RatLog: ["+this.ratLogLink+"]: contents are null or empty. ");
      this.ratLog = "";
    }
    else{
      this.ratLog = log;
    }
    licenseSpread = new HashMap<>();
    unapprovedLicenseFiles = new ArrayList<>();
  }

  public RatLog parse() {
    if (!hasBeenParsed && !isBlank()) {
      try {
        parseFileLineByLine();
        hasBeenParsed = true;
      } catch (IOException ioe) {
        ioe.printStackTrace();
      }
    }
    return this;
  }

  public Map<String, Integer> getLicenseHistogram() {
    return this.licenseSpread;
  }

  public List<String> getUnapprovedLicenseFiles() {
    return this.unapprovedLicenseFiles;
  }
  
  public void parseUnapprovedFiles(String line) {
    line = line.trim();
    if (line.length() > 0) { // check if line is just whitespace
      if (!line.startsWith(UNAPPROVED_LICENSES)) { // if it's not just white
                                                   // space, check if it is a
                                                   // file path or not
        unapprovedLicenseFiles.add(line);
      }
    }
  }
  
  private boolean isBlank(){
    return this.ratLog == null || 
        (this.ratLog != null && this.ratLog.isEmpty());
  }

  private void parseFileLineByLine() throws IOException {
    String[] lines = this.ratLog.split("\n");
    List<Integer> sectionDelimiters = getSectionDelimiters(lines);
    // the first two delimiters (0 and 1) represent the bounds of the header
    for (int i = sectionDelimiters.get(0) + 1; i < sectionDelimiters.get(1); i++) {
      parseHeader(lines[i]);
    }
    // the next two (1 and 2) represent the unapproved licenses bounds
    for (int i = sectionDelimiters.get(1) + 1; i < sectionDelimiters.get(2); i++) {
      parseUnapprovedFiles(lines[i]);
    }
  }

  private List<Integer> getSectionDelimiters(String[] lines) {
    List<Integer> sectionDelimiters = new ArrayList<Integer>();
    for (int i = 0; i < lines.length; i++) {
      if (lines[i].startsWith(SECTION_SEPARATOR)) {
        sectionDelimiters.add(i);
      }
    }
    return sectionDelimiters;
  }

  private boolean parseHeader(String line) {
    for (String licenseType : LICENSE_VALUES) {
      if (line.startsWith(licenseType + ":")) {
        String lineParts[] = line.split(":");
        if (lineParts.length > 1) {
          licenseSpread.put(licenseType,
              Integer.parseInt((lineParts[1]).trim()));
        }
        LICENSE_VALUES.remove(licenseType);
        return true;
      }
    }
    if (line.contains(UNKNOWN)) {
      licenseSpread.put(UNKNOWN, Integer.parseInt((line.split(" ")[0]).trim()));
      return false;
    }
    return true;
  }

}
