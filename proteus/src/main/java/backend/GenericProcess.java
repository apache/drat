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

package backend;

import java.io.IOException;
import java.io.InputStreamReader;
import java.util.logging.Logger;
import java.io.FileWriter;
import java.io.BufferedReader;
import java.io.InputStream;
import java.io.BufferedWriter;
import java.io.File;

public class GenericProcess {
  private final String path;
  private final static Logger LOG = Logger.getLogger(GenericProcess.class.getName());

  public GenericProcess(String path) {
    this.path = path;
  }

  public Process createProcess(String command) throws IOException {
    LOG.info("Invoking command: ["+command+"] on path: ["+path+"]");
    ProcessBuilder builder = new ProcessBuilder(this.path, command);
    return spawnProcess(builder);
  }

  public Process createProcess(String command, String canonicalPath)
      throws IOException {
    LOG.info("Invoking command: ["+command+"]: at canonical path: ["+canonicalPath+"]: path: ["+path+"]");
    ProcessBuilder builder = new ProcessBuilder(this.path, command,
        canonicalPath);
    return spawnProcess(builder);
  }

  protected static Process spawnProcess(ProcessBuilder builder) throws IOException {
    builder.environment().putAll(Utils.getEnvironment());
    LOG.info("Spawning process with environment: "+builder.environment());
    Process process = builder.redirectErrorStream(true).start();
    pipeOutputToLogFile(process.getInputStream());
    return process;
  }

  private static void pipeOutputToLogFile(InputStream processInput) throws IOException {
    BufferedReader reader = new BufferedReader(new InputStreamReader(
        processInput));
    final File dratLog = new File(FileConstants.DRAT_TEMP_LOG_OUTPUT);
    LOG.info("Redirecting output to ["+FileConstants.DRAT_TEMP_LOG_OUTPUT+"]");
    if (!dratLog.exists()) {
      dratLog.createNewFile();
    }

    FileWriter fw = new FileWriter(dratLog.getAbsoluteFile());
    BufferedWriter bw = new BufferedWriter(fw);
    String line = null;
    while ((line = reader.readLine()) != null) {
      System.out.println(line);
      bw.write(line);
    }
    bw.close();
    fw.close();
    reader.close();
  }
}
