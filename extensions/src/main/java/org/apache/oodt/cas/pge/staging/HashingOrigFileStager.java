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

package org.apache.oodt.cas.pge.staging;

import java.io.File;
import java.io.IOException;
import java.net.URI;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.apache.commons.codec.digest.DigestUtils;
import org.apache.oodt.cas.filemgr.structs.exceptions.DataTransferException;
import org.apache.oodt.cas.pge.metadata.PgeMetadata;

import com.google.common.io.Files;

public class HashingOrigFileStager extends FileManagerFileStager {

    private static final Logger LOG = 
	LoggerFactory.getLogger(HashingOrigFileStager.class);

  /*
   * (non-Javadoc)
   * 
   * @see
   * org.apache.oodt.cas.pge.staging.FileManagerFileStager#stageFile(java.net.
   * URI, java.io.File, org.apache.oodt.cas.pge.metadata.PgeMetadata,
   * java.util.logging.Logger)
   */

  public void stageFile(URI stageFile, File destDir, PgeMetadata pgeMetadata,
      Logger logger)
      throws IOException, DataTransferException, InstantiationException {
    super.stageFile(stageFile, destDir, pgeMetadata, logger);
    String appendUri = DigestUtils.md5Hex(new File(stageFile).getAbsolutePath());
    String fromPath = destDir + File.separator
        + new File(stageFile).getName();
    String toPath = destDir + File.separator + appendUri + "-"
        + new File(stageFile).getName();
    LOG.info("Orig File Path: [" + stageFile.toString() + "]: MD5 Hash: ["
        + appendUri + "]: renaming: [" + fromPath + "] to: [" + toPath + "]");
    Files.move(new File(fromPath), new File(toPath));
  }

}
