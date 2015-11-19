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

package drat.proteus.rest;

import backend.FileConstants;
import net.lingala.zip4j.core.ZipFile;
import net.lingala.zip4j.exception.ZipException;
import net.lingala.zip4j.util.Zip4jUtil;

import java.io.*;
import java.util.zip.ZipEntry;
import java.util.zip.ZipInputStream;

public class Unzipper {
  public static final String OUTPUT_FOLDER = FileConstants.DRAT_TEMP_UNZIPPED_PATH;

  public static File unzip(File zipped) throws ZipException {
    ZipFile zipFile = new ZipFile(zipped.getAbsolutePath());
    zipFile.extractAll(OUTPUT_FOLDER);
    return new File(OUTPUT_FOLDER);
  }
}
