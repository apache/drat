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

package drat.proteus.service.licenses;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.Map;

import org.apache.commons.io.FileUtils;
import org.junit.AfterClass;
import org.junit.BeforeClass;
import org.junit.Test;

import static org.junit.Assert.*;

import drat.proteus.services.licenses.RatLogFile;

public class TestRatLogFile {

  private static String ratLogFileContents;
  private static String ratLogFileContentsBlankLic;
  private static String ratLogFileUnspecifiedLicPerFile;
  private static String ratLogBinaryContents;
  private static final String ratLogFileName = "sample-rat.log";
  private static final String ratLogFileBlankLicenseCount = "sample-rat2.log";
  private static final String ratLogUnspecifiedLicensePerFile = "sample-rat3.log";
  private static final String ratLogBinary = "sample-rat4.log";
  private final static String UNKNOWN_LIC = "!?????";
  private final String expectedDate = "2017-07-29T17:10:42-07:00";
  private static final String[] licenseTypes = { "Notes", "Binaries",
      "Archives", "Standards", "Apache Licensed", "Generated Documents" };
  private static final int[] licenseCounts = { 0, 0, 0, 12, 2, 0 };
  private static final String[] unapprovedLicFiles = {
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/4819c0134b20143ab9e5e5388c33fcf0-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/4c6c80630a1ea42303d015ca8153ec2d-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/82242fcc686f97db312f733ff2c914da-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/826eff522a572b7d1bc0df86a945bc8e-CONTRIBUTING.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/c8a69d1977bbe04d44462a9e98de7fc6-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/ebd586f9d3e9a0fe416e1bf0e2d5b81a-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/f240c690773715be31ab125bee9fb8c5-CONTRIBUTING.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/fd4342f0e1cc47ef3222d5db12807438-README.md" };

  private static final String[] ratLogFiles = {
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/421e7294043e0581cae0ced0bb35008b-LICENSE.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/4819c0134b20143ab9e5e5388c33fcf0-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/4c6c80630a1ea42303d015ca8153ec2d-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/61c9938c2576418a6de2a01002f6cd19-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/82242fcc686f97db312f733ff2c914da-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/826eff522a572b7d1bc0df86a945bc8e-CONTRIBUTING.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/c8a69d1977bbe04d44462a9e98de7fc6-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/d54b61d46665f629220de71c2d85201c-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/db6934b99687afc0427d80757583534e-LICENSE.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/ebd586f9d3e9a0fe416e1bf0e2d5b81a-README.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/f240c690773715be31ab125bee9fb8c5-CONTRIBUTING.md",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501373441424/input/fd4342f0e1cc47ef3222d5db12807438-README.md" };

  private static final String[] ratLogFileLicenses = { "AL", UNKNOWN_LIC,
      UNKNOWN_LIC, "MIT", UNKNOWN_LIC, UNKNOWN_LIC, UNKNOWN_LIC, "MIT", "AL",
      UNKNOWN_LIC, UNKNOWN_LIC, UNKNOWN_LIC };

  private static final String[] ratLogBinaryFiles = {
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501962347659/input/71d8a431d5ea53f3aaf0a06ea7b9b188-DRAT-Workflow-Wangler.pdf",
      "/Users/mattmann/drat/deploy/data/jobs/rat/1501962347659/input/da9083b9beb0827804591899c66f31e6-IWSM15.pdf" };

  private static final String unspecifiedLicUnknownKey = "/Users/mattmann/drat/deploy/data/jobs/rat/1501912823777/input/8fb403b70729d1d76218b246615c9b7c-prototype.js";

  @BeforeClass
  public static void prepare() throws InstantiationException {
    ratLogFileContents = loadFile(ratLogFileName);
    ratLogFileContentsBlankLic = loadFile(ratLogFileBlankLicenseCount);
    ratLogFileUnspecifiedLicPerFile = loadFile(ratLogUnspecifiedLicensePerFile);
    ratLogBinaryContents = loadFile(ratLogBinary);
  }

  @Test
  public void testRatLogBinary() {
    RatLogFile ratLog = new RatLogFile(null, ratLogBinaryContents);
    assertNotNull(ratLog);
    assertNotNull(ratLog.getDetectedLicensesPerFile());
    assertNotNull(ratLog.getDetectedLicensesPerFile().keySet());
    assertEquals(2, ratLog.getDetectedLicensesPerFile().keySet().size());
    for (int i = 0; i < ratLogBinaryFiles.length; i++) {
      assertTrue(ratLog.getDetectedLicensesPerFile()
          .containsKey(ratLogBinaryFiles[i]));
      assertNotNull(
          ratLog.getDetectedLicensesPerFile().get(ratLogBinaryFiles[i]));
      assertTrue(ratLog.getDetectedLicensesPerFile().get(ratLogBinaryFiles[i])
          .equals("B"));
    }

  }

  @Test
  public void testBlankLicensePerFile() {
    RatLogFile ratLog = new RatLogFile(null, ratLogFileUnspecifiedLicPerFile);
    assertNotNull(ratLog);
    assertNotNull(ratLog.getDetectedLicensesPerFile());
    assertNotNull(ratLog.getDetectedLicensesPerFile().keySet());
    assertEquals(100, ratLog.getDetectedLicensesPerFile().keySet().size());
    assertNotNull(
        ratLog.getDetectedLicensesPerFile().get(unspecifiedLicUnknownKey));
    assertEquals("UNKNOWN",
        ratLog.getDetectedLicensesPerFile().get(unspecifiedLicUnknownKey));
  }

  @Test
  public void testBlankLicCount() {
    RatLogFile ratLog = new RatLogFile(null, ratLogFileContentsBlankLic);
    assertNotNull(ratLog);
    assertNotNull(ratLog.getLicenseCounts());
    assertTrue(ratLog.getLicenseCounts().keySet().size() > 0);
    assertEquals(6, ratLog.getLicenseCounts().keySet().size());
    int notes = ratLog.getLicenseCounts().get("Notes");
    int binaries = ratLog.getLicenseCounts().get("Binaries");
    int archives = ratLog.getLicenseCounts().get("Archives");

    assertEquals(0, notes);
    assertEquals(0, binaries);
    assertEquals(0, archives);
  }

  @Test
  public void testReadGeneratedDate() {
    RatLogFile ratLog = new RatLogFile(null, ratLogFileContents);
    assertNotNull(ratLog);
    assertEquals(expectedDate, ratLog.getGeneratedDateStr());
  }

  @Test
  public void testReadLicenseCounts() {
    RatLogFile ratLog = new RatLogFile(null, ratLogFileContents);
    assertNotNull(ratLog);
    Map<String, Integer> licCounts = ratLog.getLicenseCounts();
    assertNotNull(licCounts);
    for (int i = 0; i < licenseTypes.length; i++) {
      int readLicCount = licCounts.get(licenseTypes[i]);
      assertEquals(readLicCount, licenseCounts[i]);
    }
  }

  @Test
  public void testReadUnapprovedLicFiles() {
    RatLogFile ratLog = new RatLogFile(null, ratLogFileContents);
    assertNotNull(ratLog);
    List<String> unapproved = ratLog.getUnapprovedLicensedFiles();
    assertNotNull(unapproved);
    assertEquals(Arrays.asList(unapprovedLicFiles), unapproved);
  }

  @Test
  public void testReadRatLogFileLicenses() {
    RatLogFile ratLog = new RatLogFile(null, ratLogFileContents);
    assertNotNull(ratLog);
    Map<String, String> ratLogLicenses = ratLog.getDetectedLicensesPerFile();
    assertNotNull(ratLogLicenses);
    assertNotNull(ratLogLicenses.keySet());
    assertEquals(ratLogFiles.length, ratLogLicenses.keySet().size());
    for (int i = 0; i < ratLogFiles.length; i++) {
      String ratLogFilePath = ratLogFiles[i];
      String ratLogDetectedLic = ratLogFileLicenses[i];
      assertEquals(ratLogDetectedLic, ratLogLicenses.get(ratLogFilePath));
    }
  }

  @AfterClass
  public static void after() {
    ratLogFileContents = null;
    ratLogFileContentsBlankLic = null;
    ratLogFileUnspecifiedLicPerFile = null;
    ratLogBinaryContents = null;
  }

  private static String loadFile(String filename)
      throws InstantiationException {
    String ratLogFilePath = TestRatLogFile.class.getResource(filename)
        .getFile();
    String contents = null;
    try {
      contents = FileUtils.readFileToString(new File(ratLogFilePath));
    } catch (IOException e) {
      e.printStackTrace();
      throw new InstantiationException(
          "Unable to read RatLog: [" + ratLogFilePath + "]");
    }

    return contents;
  }

}
