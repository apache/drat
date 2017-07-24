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

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.PumpStreamHandler;
import org.apache.commons.io.FileUtils;
import org.apache.oodt.cas.filemgr.system.XmlRpcFileManagerClient;
import org.apache.oodt.cas.workflow.system.XmlRpcWorkflowManagerClient;

import com.google.common.annotations.VisibleForTesting;
import com.google.common.base.Joiner;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

public class ProcessDratWrapper extends GenericProcess
    implements AbstractDratWrapper {
  private static final Logger LOG = Logger
      .getLogger(ProcessDratWrapper.class.getName());
  private static final String DRAT = FileConstants.DRAT_PATH;
  private static final long DRAT_PROCESS_WAIT_DURATION = 3000;

  private static final String GO_CMD = "go";
  private static final String CRAWL_CMD = "crawl";
  private static final String INDEX_CMD = "index";
  private static final String MAP_CMD = "map";
  private static final String REDUCE_CMD = "reduce";

  private static final String MAPPER_TASK = "urn:drat:RatCodeAudit";

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
        FileUtils.forceDelete(file);
      } catch (FileNotFoundException e) {
        LOG.info("Error removing: ["+file.getAbsolutePath()+"]: Message: "+e.getMessage());
      }
    }
    
    LOG.info("DRAT: reset: recursively removed: ["+Utils.getResetDirectories()+"]");
    LOG.info("DRAT: reset: performing dynamic reset of FM and WM catalog/repos");
    
    XmlRpcFileManagerClient fm;
    XmlRpcWorkflowManagerClient wm;
    
    //TODO: finish this method
    
  }

  public void go() throws Exception {
    startAndMonitorDratProcess(CRAWL_CMD).waitFor();
    Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
    startAndMonitorDratProcess(INDEX_CMD).waitFor();
    Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
    startAndMonitorDratProcess(MAP_CMD).waitFor();
    Thread.sleep(DRAT_PROCESS_WAIT_DURATION * 4L); // wait 12 seconds after drat
                                                   // map for all mappers to be
                                                   // added
    // don't run reduce until all maps are done
    while (mapsStillRunning()) {
      Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
    }
    startAndMonitorDratProcess(REDUCE_CMD).waitFor();
  }

  public boolean isRunning() throws Exception {
    return status.isRunning();
  }

  public DratServiceStatus getDratStatus() {
    return status;
  }

  private boolean mapsStillRunning() throws Exception {
    String args[] = { FileConstants.WORKFLOW_PATH, "--url",
        "http://localhost:9001", "--operation", "--getWorkflowInsts" };
    String cmd = Joiner.on(" ").join(args);
    String output = execToString(cmd);
    List<WorkflowItem> items = parseWorkflows(output);
    return stillRunning(items);
  }

  @VisibleForTesting
  protected List<WorkflowItem> parseWorkflows(String cmdOutput) {
    List<WorkflowItem> items = new ArrayList<WorkflowItem>();

    String lines[] = cmdOutput.split("\\r?\\n");
    if (lines != null && lines.length > 0) {
      for (String line : lines) {
        String[] tmpLine = line.split("\\[");
        if (tmpLine != null && tmpLine.length > 0) {
          String instInfo = tmpLine[1].trim();
          instInfo = instInfo.substring(0, instInfo.length() - 1); // chop ']'
          String[] instToks = instInfo.split(",");
          if (instToks != null && instToks.length > 0) {
            WorkflowItem item = new WorkflowItem();
            item.setId(cleanAndSplit(instToks[0]));
            item.setStatus(cleanAndSplit(instToks[1]));
            item.setCurrentTask(cleanAndSplit(instToks[2]));
            item.setWorkflowName(cleanAndSplit(instToks[3]));
            item.setWallClockTime(cleanAndSplit(instToks[4]));
            item.setCurrentTaskWallClock(cleanAndSplit(instToks[5]));
            items.add(item);
          }
        }
      }
    }
    return items;
  }

  @VisibleForTesting
  protected boolean stillRunning(List<WorkflowItem> items) {
    List<WorkflowItem> mapperItems = filterMappers(items);
    LOG.info("Checking mappers: inspecting ["
        + String.valueOf(mapperItems.size()) + "] mappers.");
    for (WorkflowItem mapperItem : mapperItems) {
      if (mapperItem.getStatus().equals("PGE EXEC")) {
        LOG.info("Mapper: [" + mapperItem.getId() + "] still running.");
        return true;
      }
    }

    return false;
  }

  @VisibleForTesting
  protected List<WorkflowItem> filterMappers(List<WorkflowItem> items) {
    List<WorkflowItem> mappers = new ArrayList<WorkflowItem>();
    if (items != null && items.size() > 0) {
      for (WorkflowItem item : items) {
        if (item.getCurrentTask().equals(MAPPER_TASK)) {
          LOG.info("Adding mapper: [" + item.getCurrentTask() + "]");
          mappers.add(item);
        } else {
          LOG.info("Filtering task: [" + item.getCurrentTask() + "]");
        }
      }
    }

    return mappers;
  }

  @VisibleForTesting
  protected boolean isRunning(String status) {
    List<String> runningStates = Arrays.asList("CREATED", "QUEUED", "STARTED",
        "RSUBMIT", "PGE EXEC");
    List<String> finishedStates = Arrays.asList("PAUSED", "METMISS", "FINISHED");
    if (finishedStates.contains(status)) {
      return false;
    } else {
      if (runningStates.contains(status)) {
        return true;
      } else {
        // it's not in running or finished, so we'll assume
        // it's not running (dead)
        LOG.info("Unknown status: [" + status + "]: assuming finished.");
        return false;
      }
    }
  }

  private String cleanAndSplit(String s) {
    String[] sToks = s.split("=");
    if (sToks != null && sToks.length == 2) {
      return sToks[1].trim();
    } else
      return "";
  }

  private synchronized Process startAndMonitorDratProcess(String dratCmd)
      throws IOException, DratWrapperException {
    DratServiceStatus.State dratState = DratServiceStatus.State
        .valueOf(dratCmd.toUpperCase());
    boolean needsPathParam = (dratState == DratServiceStatus.State.CRAWL)
        || (dratState == DratServiceStatus.State.INDEX);
    if (status.isRunning()) {
      throw new DratWrapperException(
          "Drat is currently running with status: " + status.getCurrentState());
    }
    status.setCurrentState(dratState);
    Process process = (needsPathParam) ? super.createProcess(dratCmd, this.path)
        : super.createProcess(dratCmd);
    DratProcessMonitor monitor = new DratProcessMonitor(status, process,
        dratCmd);
    new Thread(monitor).start();
    return process;
  }

  private synchronized String execToString(String command) throws Exception {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    CommandLine commandline = CommandLine.parse(command);
    DefaultExecutor exec = new DefaultExecutor();
    PumpStreamHandler streamHandler = new PumpStreamHandler(outputStream);
    exec.setStreamHandler(streamHandler);
    exec.execute(commandline);
    return (outputStream.toString());
  }

}
