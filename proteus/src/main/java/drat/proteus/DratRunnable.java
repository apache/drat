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

package drat.proteus;

import backend.DratWrapperException;
import backend.ProcessDratWrapper;

import java.io.File;
import java.util.logging.Logger;

class DratRunnable implements Runnable {
  private final String filePath;
  private final String command;
  private static final Logger LOG = Logger.getLogger(DratRunnable.class.getName());

  public DratRunnable(String filePath, String cmd) {
    this.filePath = filePath;
    this.command = cmd;
  }

  @Override
  public void run() {
    String cmdToUpper = command.toUpperCase();
    ProcessDratWrapper dratWrapper = ProcessDratWrapper.getInstance();
    dratWrapper.setIndexablePath(this.filePath);
    try {
      switch (cmdToUpper) {
      case "GO": {
        dratWrapper.go();
        break;
      }
      case "CRAWL": {
        dratWrapper.crawl();
        break;
      }
      case "REDUCE": {
        dratWrapper.reduce();
        break;
      }
      case "MAP": {
        dratWrapper.map();
        break;
      }
      case "INDEX": {
        dratWrapper.index();
        break;
      }
      case "RESET" : {
        dratWrapper.reset();
        break;
      }
      default: {
        throw new DratWrapperException("No matching step found for selection: "
            + command);
      }
      }
      if (this.filePath != null)
        deleteTempDratDirectory(filePath);
    } catch (Exception e) {
      e.printStackTrace();
      LOG.warning("Error executing command: ["+cmdToUpper+"]: Message: "+e.getLocalizedMessage());
    }
  }

  public void deleteTempDratDirectory(String filePath) {
    new File(filePath).delete();
  }
}