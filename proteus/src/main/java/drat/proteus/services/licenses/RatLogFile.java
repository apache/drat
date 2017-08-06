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

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

public class RatLogFile {

  private static final Logger LOG = Logger
      .getLogger(RatLogFile.class.getName());
  private static final String GENERATED_AT_TIME = "Generated at:";
  private static final String[] LICENSE_TYPES = { "Notes", "Binaries",
      "Archives", "Standards", "Apache Licensed", "Generated Documents" };

  private static final String END_OF_PARSING_MARKER = "Printing headers";
  private static final String UNAPPROVED_LICENSES = "Files with unapproved licenses";
  private static final String BOUNDARY_HEADER_MARKER_SKIP = "*****************************************************";
  private static final String LICENSE_FILES_MARKER = "Notices, licenses etc. will be marked N";

  private Map<String, String> detectedLicensesPerFile;
  private List<String> unapprovedLicensedFiles;
  private Map<String, Integer> licenseCounts;
  private String generatedDateStr;
  private String ratLogLinkUrlStr;

  /**
   * An object representing a log file produced by Rat.
   */
  public RatLogFile(String ratLogLinkUrlStr, String contents) {
    super();
    this.detectedLicensesPerFile = new ConcurrentHashMap<String, String>();
    this.unapprovedLicensedFiles = new ArrayList<String>();
    this.licenseCounts = new ConcurrentHashMap<String, Integer>();
    this.generatedDateStr = "";
    this.ratLogLinkUrlStr = ratLogLinkUrlStr;
    this.parse(contents);
  }

  /**
   * @return the ratLogLinkUrlStr
   */
  public String getRatLogLinkUrlStr() {
    return ratLogLinkUrlStr;
  }

  /**
   * @param ratLogLinkUrlStr
   *          the ratLogLink to set
   */
  public void setRatLogLinkUrlStr(String ratLogLinkUrlStr) {
    this.ratLogLinkUrlStr = ratLogLinkUrlStr;
  }

  /**
   * @return the detectedLicensesPerFile
   */
  public Map<String, String> getDetectedLicensesPerFile() {
    return detectedLicensesPerFile;
  }

  /**
   * @param detectedLicensesPerFile
   *          the detectedLicensesPerFile to set
   */
  public void setDetectedLicensesPerFile(
      Map<String, String> detectedLicensesPerFile) {
    this.detectedLicensesPerFile = detectedLicensesPerFile;
  }

  /**
   * @return the unapprovedLicensedFiles
   */
  public List<String> getUnapprovedLicensedFiles() {
    return unapprovedLicensedFiles;
  }

  /**
   * @param unapprovedLicensedFiles
   *          the unapprovedLicensedFiles to set
   */
  public void setUnapprovedLicensedFiles(List<String> unapprovedLicensedFiles) {
    this.unapprovedLicensedFiles = unapprovedLicensedFiles;
  }

  /**
   * @return the licenseCounts
   */
  public Map<String, Integer> getLicenseCounts() {
    return licenseCounts;
  }

  /**
   * @param licenseCounts
   *          the licenseCounts to set
   */
  public void setLicenseCounts(Map<String, Integer> licenseCounts) {
    this.licenseCounts = licenseCounts;
  }

  /**
   * @return the generatedDateStr
   */
  public String getGeneratedDateStr() {
    return generatedDateStr;
  }

  /**
   * @param generatedDateStr
   *          the generatedDateStr to set
   */
  public void setGeneratedDate(String generatedDateStr) {
    this.generatedDateStr = generatedDateStr;
  }

  private void parse(String contents) {
    if (isBlank(contents)) {
      LOG.warning("Rat Log: [" + this.ratLogLinkUrlStr
          + "]: contents are null or blank, cannot parse.");
      return;
    }

    String[] lines = contents.split("\\r?\\n");
    if (lines != null && lines.length > 0) {
      int lineNo = 1;
      boolean parsingUnapproved = false;
      boolean parsingLicenseFiles = false;

      for (String line : lines) {
        if (line.contains(BOUNDARY_HEADER_MARKER_SKIP) && !parsingUnapproved
            && !parsingLicenseFiles) {
          LOG.info("RAT log: boundary marker at line: ["
              + String.valueOf(lineNo) + "]: Skipping.");
          lineNo++;
          continue;
        }

        if (parsingUnapproved) {
          if (line.contains(BOUNDARY_HEADER_MARKER_SKIP)) {
            LOG.info("Done parsing unapproved.");
            parsingUnapproved = false;
          } else {
            if (!isBlank(line)) {
              this.unapprovedLicensedFiles.add(line.trim());
            }
          }
        } else {
          if (line.startsWith(GENERATED_AT_TIME)) {
            String[] toks = line.trim().split(" ");
            this.generatedDateStr = toks[2].trim();
          }

          for (String type : LICENSE_TYPES) {
            if (line.startsWith(type + ":")) {
              String[] toks = line.split(":");
              if (toks != null && toks.length == 2) {
                int lCount = -1;
                try {
                  lCount = Integer.valueOf(toks[1].trim());
                } catch (NumberFormatException e) {
                  LOG.warning("Unable to parse tok: [" + toks[1].trim()
                      + "]: setting value to 0: Message: "
                      + e.getLocalizedMessage());
                  lCount = 0;
                }
                this.licenseCounts.put(type, lCount);
              } else {
                LOG.warning("ERROR parsing license types: type: [" + type
                    + "] from line: [" + line
                    + "]: != 2 tokens: total toks: from split on : is ["
                    + (toks != null ? toks.length : "UNKNOWN, toks=null")
                    + "]");

                if (toks != null && toks.length == 1) {
                  // just means it was a line like Archives:
                  // without specifying 0, it means zero, so we'll put zero
                  LOG.warning("Adding license count: [0] for type: [" + type
                      + "]: line to parse: [" + line + "]");
                  this.licenseCounts.put(type, 0);
                }
              }
            }
          }
        }

        if (parsingLicenseFiles) {
          if (line.contains(BOUNDARY_HEADER_MARKER_SKIP)) {
            LOG.info("Done parsing licenses for files.");
            parsingLicenseFiles = false;
            lineNo++;
            continue;
          } else {
            if (!isBlank(line)) {
              LOG.finest("parsing license files, unblank line: [" + line
                  + "]: file: " + this.ratLogLinkUrlStr);
              String[] toks = line.trim().split("\\s+");
              if (toks != null && toks.length == 2) {
                this.detectedLicensesPerFile.put(toks[1], toks[0]);
              } else {
                LOG.warning("Error parsing licenses per file: [" + line
                    + "]: parsed: [" + (toks != null ? toks.length : 0)
                    + "] tokens. Adding as UNKNOWN");
                if (toks != null && toks.length == 1) {
                  this.detectedLicensesPerFile.put(toks[0], "UNKNOWN");
                }
              }
            }
          }

        }

        if (line.startsWith(UNAPPROVED_LICENSES)) {
          parsingUnapproved = true;
        }

        if (line.contains(LICENSE_FILES_MARKER)) {
          parsingLicenseFiles = true;
        }

        if (line.trim().startsWith(END_OF_PARSING_MARKER)) {
          LOG.info("Stopping RAT log parsing: [" + this.ratLogLinkUrlStr
              + "]: end of parsing marker. lineNo: [" + String.valueOf(lineNo)
              + "]");
          lineNo++;
          break;
        }

        lineNo++;
      }

      LOG.info("Done parsing RAT log: [" + this.ratLogLinkUrlStr
          + "]: total lines: [" + String.valueOf(lineNo) + "]");
    }

  }

  private boolean isBlank(String ratLog) {
    return ratLog == null || (ratLog != null && ratLog.isEmpty())
        || (ratLog != null && ratLog.trim().equals(""));
  }

}
