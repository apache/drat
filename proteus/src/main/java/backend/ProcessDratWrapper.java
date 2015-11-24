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

import drat.proteus.services.general.DratServiceStatus;
import org.apache.commons.io.FileUtils;

import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;

public class ProcessDratWrapper extends GenericProcess implements
    AbstractDratWrapper {
  private static final String DRAT = FileConstants.DRAT_PATH;
  private static final long DRAT_PROCESS_WAIT_DURATION = 3000;

  private static final String GO_CMD = "go";
  private static final String CRAWL_CMD = "crawl";
  private static final String INDEX_CMD = "index";
  private static final String MAP_CMD = "map";
  private static final String REDUCE_CMD = "reduce";

  private String path;
  private DratServiceStatus status = new DratServiceStatus();
  private static ProcessDratWrapper singletonDratWrapper = new ProcessDratWrapper();

  public static ProcessDratWrapper getInstance() {
    return singletonDratWrapper;
  }

  private ProcessDratWrapper() {
    super(DRAT);
    this.path = "";
  }

  public void setIndexablePath(String canonicalPath) {
    this.path = canonicalPath;
  }

  public String getIndexablePath() {
    return this.path;
  }

  public void crawl() throws IOException, DratWrapperException {
    startAndMonitorDratProcess(CRAWL_CMD);
  }

  public void index() throws IOException, DratWrapperException {
    startAndMonitorDratProcess(INDEX_CMD);
  }

  public void map() throws IOException, DratWrapperException {
    startAndMonitorDratProcess(MAP_CMD);
  }

  public void reduce() throws IOException, DratWrapperException {
    startAndMonitorDratProcess(REDUCE_CMD);
  }

  public void reset() throws Exception {
    for (String dir : Utils.getResetDirectories()) {
      File file = new File(dir);
      try {
        FileUtils.forceDelete(new File(dir));
      } catch (FileNotFoundException fnfe) {
        // do nothing, since if the file isn't found... don't need to delete it
      }
    }
  }

  public void go() throws Exception {
    startAndMonitorDratProcess(CRAWL_CMD).waitFor();
    Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
    startAndMonitorDratProcess(INDEX_CMD).waitFor();
    Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
    startAndMonitorDratProcess(MAP_CMD).waitFor();
    Thread.sleep(10000);
    startAndMonitorDratProcess(REDUCE_CMD).waitFor();
  }

  private Process startAndMonitorDratProcess(String dratCmd)
      throws IOException, DratWrapperException {
    DratServiceStatus.State dratState = DratServiceStatus.State.valueOf(dratCmd
        .toUpperCase());
    boolean needsPathParam = (dratState == DratServiceStatus.State.CRAWL)
        || (dratState == DratServiceStatus.State.INDEX);
    if (status.isRunning()) {
      throw new DratWrapperException("Drat is currently running with status: "
          + status.getCurrentState());
    }
    status.setCurrentState(dratState);
    Process process = (needsPathParam) ? super
        .createProcess(dratCmd, this.path) : super.createProcess(dratCmd);
    DratProcessMonitor monitor = new DratProcessMonitor(status, process);
    new Thread(monitor).start();
    return process;
  }

  public boolean isRunning() throws Exception {
    return status.isRunning();
  }

  public DratServiceStatus getDratStatus() {
    return status;
  }
}
