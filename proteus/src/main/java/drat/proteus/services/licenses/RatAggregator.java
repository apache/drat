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

import drat.proteus.services.general.Item;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.logging.Logger;

public class RatAggregator {
  private Map<String, Integer> licenses;
  private List<Item> ratUnapprovedLicenses;
  private int ratCount;
  private static final Logger LOG = Logger.getLogger(RatAggregator.class.getName());

  public RatAggregator() {
    licenses = new HashMap<>();
    ratUnapprovedLicenses = new ArrayList<>();
    ratCount = 0;
  }

  public void clear() {
    licenses.clear();
    ratUnapprovedLicenses.clear();
    ratCount = 0;
  }

  public void add(RatLogFile log) {
    ratCount++;
    LOG.info("Adding Rat Log: ["+String.valueOf(ratCount)+"]: "+log.getRatLogLinkUrlStr());
    addLogToRunningTotal(log);
    addUnapprovedLicenses(log);
  }

  public Map<String, Integer> getAggregatedLicenseTotal() {
    return this.licenses;
  }

  public List<Item> getRatUnapprovedLicenses() {
    return this.ratUnapprovedLicenses;
  }

  private void addUnapprovedLicenses(RatLogFile log) {
    List<String> unapproved = log.getUnapprovedLicensedFiles();
    this.ratUnapprovedLicenses.add(new UnapprovedLicensesItem(ratCount,
        unapproved));
  }

  private void addLogToRunningTotal(RatLogFile log) {
    Map<String, Integer> logLicenses = log.getLicenseCounts();
    for (String key : logLicenses.keySet()) {
      Integer licenseAmountTotal = licenses.get(key);
      Integer licenseAmountLog = logLicenses.get(key);
      if (licenseAmountTotal != null) {
        licenseAmountLog += licenseAmountTotal;
      }
      licenses.put(key, licenseAmountLog);
    }
  }
}
