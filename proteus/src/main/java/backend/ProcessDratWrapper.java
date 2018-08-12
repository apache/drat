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

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.commons.exec.PumpStreamHandler;
import org.apache.commons.io.FileUtils;
import org.apache.commons.lang.time.DurationFormatUtils;
import org.apache.oodt.cas.crawl.MetExtractorProductCrawler;
import org.apache.oodt.cas.workflow.structs.WorkflowInstance;
import org.apache.oodt.pcs.util.WorkflowManagerUtils;
import org.apache.solr.client.solrj.SolrServerException;
import org.apache.solr.client.solrj.impl.CommonsHttpSolrServer;
import org.apache.oodt.cas.filemgr.structs.Product;
import org.apache.oodt.cas.filemgr.structs.ProductPage;
import org.apache.oodt.cas.filemgr.structs.ProductType;
import org.apache.oodt.cas.filemgr.tools.DeleteProduct;
import org.apache.oodt.cas.filemgr.tools.SolrIndexer;
import org.apache.oodt.cas.metadata.util.PathUtils;
import org.apache.oodt.cas.workflow.system.XmlRpcWorkflowManagerClient;
import org.apache.oodt.pcs.util.FileManagerUtils;

import com.google.common.annotations.VisibleForTesting;

import drat.proteus.workflow.rest.DynamicWorkflowRequestWrapper;
import drat.proteus.workflow.rest.WorkflowRestResource;
import org.springframework.context.support.FileSystemXmlApplicationContext;

import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileNotFoundException;
import java.io.IOException;
import java.net.URL;
import java.nio.charset.Charset;
import java.time.Instant;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.time.format.DateTimeFormatter;
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
  private static final int MAX_RESET_TRIES = 10;

  private static final String CRAWL_CMD = "crawl";
  private static final String INDEX_CMD = "index";
  private static final String MAP_CMD = "map";
  private static final String REDUCE_CMD = "reduce";
  private static final String STATUS_IDLE = "idle";
  protected static final String PARTITION_AND_MAP_TASK_ID = "urn:drat:MimePartitioner";
  protected static final String MAPPER_TASK_ID = "urn:drat:RatCodeAudit";
  protected static final String REDUCE_TASK_ID = "urn:drat:RatAggregator";
  private static final String[] WIPE_TYPES = { "RatLog", "GenericFile",
      "RatAggregateLog" };

  private String status;
  public String urlLoc;
  private FileManagerUtils fm;
  private String path;
  private static ProcessDratWrapper singletonDratWrapper = new ProcessDratWrapper();

  public static ProcessDratWrapper getInstance() {
    return singletonDratWrapper;
  }

  private ProcessDratWrapper() {
    super(DRAT);
    this.path = "";
    this.urlLoc="";
    this.status = "IDLE";
    this.fm = new FileManagerUtils(
        PathUtils.replaceEnvVariables("[FILEMGR_URL]"));
  }

  public void setIndexablePath(String canonicalPath) {
    this.path = canonicalPath;
  }

  public String getIndexablePath() {
    return this.path;
  }

  public String getUrlLoc() {
    return urlLoc;
  }

  public void setUrlLoc(String urlLoc) {
    this.urlLoc = urlLoc;
  }

  public String getStatus() {
    return this.status;
  }

  public synchronized void setStatus(String status) {
    this.status = status;
  }

  @Override
  public void crawl() throws Exception {
      DratLog crawlLog = new DratLog("CRAWLING");

      versionControlCheck();
      try{
          setStatus(CRAWL_CMD);

          crawlLog.logInfo("Configuring");
          String beanRepo = System.getProperty("org.apache.oodt.cas.crawl.bean.repo",
                  FileConstants.CRAWLER_CONFIG);
          String crawlerId = "MetExtractorProductCrawler";
          System.setProperty("DRAT_EXCLUDE","");
          FileSystemXmlApplicationContext appContext = new FileSystemXmlApplicationContext("file:"+beanRepo);

          MetExtractorProductCrawler crawler = new MetExtractorProductCrawler();
          crawler.setApplicationContext(appContext);
          crawler.setId(crawlerId);
          crawler.setMetExtractor("org.apache.oodt.cas.metadata.extractors.CopyAndRewriteExtractor");
          crawler.setMetExtractorConfig(FileConstants.MET_EXT_CONFIG_PATH);
          crawler.setFilemgrUrl(FileConstants.FILEMGR_URL);
          crawler.setClientTransferer("org.apache.oodt.cas.filemgr.datatransfer.InPlaceDataTransferFactory");
          crawler.setPreCondIds(Arrays.asList("RegExExcludeComparator"));
          crawler.setProductPath(this.path);
          crawlLog.logInfo("STARTING ",null);
          crawler.crawl();
          crawlLog.logInfo("COMPLETED",null);
      }catch (Exception ex) {
          crawlLog.logSevere("ERROR ",ex.getLocalizedMessage());
          ex.printStackTrace();
          throw ex;
      }
  }

  private void versionControlCheck() throws Exception {
    File dirPathFile = new File(this.path);
    boolean clone=false;
    if(dirPathFile.exists() ){
      if(dirPathFile.isDirectory()&& dirPathFile.list().length==0){
        clone=true;
      }
    }else{
      dirPathFile.createNewFile();
      clone =true;
    }
    if(clone){
      parseAsVersionControlledRepo();
    }
  }

  @Override
  public void index() throws IOException, DratWrapperException, InstantiationException, SolrServerException {
      solrIndex();
  }
  
  private synchronized void solrIndex() throws InstantiationException, SolrServerException, IOException {
      setStatus(INDEX_CMD);
      DratLog idl = new DratLog("INDEXING");
      idl.logInfo("Starting", null);
      System.setProperty(FileConstants.SOLR_INDEXER_CONFIG,FileConstants.SOLR_INDEXER_CONFIG_PATH);
      SolrIndexer sIndexer = new SolrIndexer(FileConstants.SOLR_DRAT_URL,FileConstants.FILEMGR_URL);
      sIndexer.indexAll(false);
      sIndexer.commit();
      sIndexer.optimize();
      idl.logInfo("Completed",null);
  }

  @Override
  public void map() {
    setStatus(MAP_CMD);
    DratLog mapLog = new DratLog("MAPPING");
    WorkflowRestResource restResource = new WorkflowRestResource();
    DynamicWorkflowRequestWrapper requestBody = new DynamicWorkflowRequestWrapper();
    requestBody.taskIds = new ArrayList<>();
    requestBody.taskIds.add(PARTITION_AND_MAP_TASK_ID);
    LOG.info("STARTING MAPPING");
    mapLog.logInfo("STARTING", " (dynamic workflow with task "+PARTITION_AND_MAP_TASK_ID);
    String resp = restResource.performDynamicWorkFlow(requestBody);
    if(resp.equals("OK")) {
        mapLog.logInfo("STARTED SUCCESSFULLY, "+PARTITION_AND_MAP_TASK_ID+" dynamic workflow");
    }else {
        mapLog.logSevere("FAILED", "Dynamic workflow starting failed "+resp);
    }
  }

  @Override
  public void reduce() throws IOException {
    setStatus(REDUCE_CMD);
    DratLog reduceLog = new DratLog("REDUCING");
    WorkflowRestResource restResource = new WorkflowRestResource();
    DynamicWorkflowRequestWrapper requestBody = new DynamicWorkflowRequestWrapper();
    requestBody.taskIds = new ArrayList<>();
    requestBody.taskIds.add(REDUCE_TASK_ID);
    LOG.info("STARTING REDUCING");
    reduceLog.logInfo("STARTING", " (dynamic workflow with task "+REDUCE_TASK_ID);
    String resp = (String)restResource.performDynamicWorkFlow(requestBody);
    if(resp.equals("OK")) {
        reduceLog.logInfo("STARTED SUCCESSFULLY, "+REDUCE_TASK_ID+" dynamic workflow");
    }else {
        reduceLog.logSevere("FAILED", "Dynamic workflow starting failed "+resp);
        throw new IOException(resp);
    }
  }

  @Override
  public void reset() {
//    LOG.info("DRAT: reset: wiping FM product catalog");
    DratLog resetLog = new DratLog("RESET");
    resetLog.logInfo("Starting","");
    for (String type : WIPE_TYPES) {
      int numTries = 0;
      ProductType pType = fm.safeGetProductTypeByName(type);
      // make sure all products are actually deleted in case there
      // are references issues or XML-RPC issues.
      while (this.fm.safeGetNumProducts(pType) > 0
          && numTries <= MAX_RESET_TRIES) {
        this.wipeProductType(type);
        numTries++;
      }

      if (numTries == MAX_RESET_TRIES
          && this.fm.safeGetNumProducts(pType) > 0) {
        resetLog.logWarning("Unable to fully wipe type: [" + type + "]. Tried ["
            + String.valueOf(numTries) + "] times. Max attempts: ["
            + String.valueOf(MAX_RESET_TRIES)
            + "]. Is your File Manager corrupt?");
      }
    }

    resetLog.logInfo("DRAT: reset: wiping WM instance repository.");
    String wmUrl = PathUtils.replaceEnvVariables("[WORKFLOW_URL]");
    this.wipeInstanceRepo(wmUrl);

    String coreName = "drat";
    resetLog.logInfo("DRAT: reset: wiping Solr core: [" + coreName + "]");
    this.wipeSolrCore(coreName);
  
    resetLog.logInfo("DRAT: reset: recursively removed: [" + Utils.getResetDirectories()
        + "]");
    for (String dir : Utils.getResetDirectories()) {
      File file = new File(dir);
      if (file.exists()) {
        try {
          resetLog.logInfo(
              "DRAT: reset: removing dir: [" + file.getAbsolutePath() + "]");
          FileUtils.forceDelete(file);
        } catch (FileNotFoundException e) {
          resetLog.logInfo("Error removing: [" + file.getAbsolutePath()
              + "]: Message: " + e.getLocalizedMessage());
        } catch (IOException e) {
          resetLog.logInfo("Unable to remove file: [" + file.getAbsolutePath()
              + "]: Message: " + e.getLocalizedMessage());
        }
      }
    }
  
    resetLog.logInfo("Finished","");
  }

  public void go() throws Exception {
    // before go, always reset
    versionControlCheck();
    this.reset();
    this.crawl();
    this.solrIndex();
    this.map();

    // don't run reduce until all maps are done
    while (stillRunning(PARTITION_AND_MAP_TASK_ID) || stillRunning(MAPPER_TASK_ID)) {
      Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
      LOG.info("MAP STILL RUNNING");
    }
    // you're not done until the final log is generated.
    while (!hasAggregateRatLog()) {
      try {
        if (!stillRunning(REDUCE_TASK_ID)) {
          reduce();
        }
        else {
          LOG.info("REDUCE STILL RUNNING.");
        }
      } catch (IOException e) {
        LOG.warning("Fired reduce off before mappers were done. Sleeping: ["
            + String.valueOf(DRAT_PROCESS_WAIT_DURATION / 1000)
            + "] seconds and will try again.");
      }
      Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
    }

    setStatus(STATUS_IDLE);
  }


  private synchronized boolean hasAggregateRatLog() {
    int numLogs = -1;
    ProductType type = this.fm.safeGetProductTypeByName("RatAggregateLog");
    numLogs = this.fm.safeGetNumProducts(type);
    String breakStatus = (numLogs > 0) ? "breaking" : "looping";
    LOG.info("Checking for RatAggregateLog: num: [" + String.valueOf(numLogs)
        + "]: " + breakStatus);
    return numLogs > 0;
  }
  
  private boolean stillRunning(String taskId) throws Exception {
        WorkflowManagerUtils workflowManagerUtils = new WorkflowManagerUtils(FileConstants.CLIENT_URL);
        List<WorkflowInstance> workflowInstances = workflowManagerUtils.getClient().getWorkflowInstances();
        for(WorkflowInstance instance : workflowInstances){
          LOG.info("Running Instances : id: "+instance.getId()
                  +" state name "+instance.getState().getName()+" current task name : "+instance.getCurrentTask().getTaskName());
        }
        return taskStillRunning(workflowInstances, taskId);            

  }

  @VisibleForTesting
  protected List<WorkflowItem> parseWorkflows(String cmdOutput) {
    List<WorkflowItem> items = new ArrayList<WorkflowItem>();

    String lines[] = cmdOutput.split("\\r?\\n");
    if (lines != null && lines.length > 0) {
      int lineNo = 1;
      for (String line : lines) {
        if (line == null || (line != null && line.trim().equals(""))) {
          LOG.info("Blank line in evaluating workflow instance response: ["
              + line + "]: skipping lineNo: [" + String.valueOf(lineNo) + "]");
          continue;
        }

        if (!line.startsWith("Instance:")) {
          LOG.info("Skipping line: does not begin with Instance: [" + line
              + "]: lineNo: [" + String.valueOf(lineNo) + "]");
          continue;
        }

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

        lineNo++;
      }
    }
    return items;
  }
  
  protected boolean taskStillRunning(List<WorkflowInstance> instances, String ...taskIds) {
    if (taskIds != null && taskIds.length > 0) {
      for(String taskId: taskIds) {
        List<WorkflowInstance> insts = filterInstances(instances, taskId);
        LOG.info("Checking task: "+taskId+" : inspecting ["+String.valueOf(instances.size())+"] tasks.");
        for(WorkflowInstance i: insts) {
         if(isRunning(i.getState().getName())) {
           LOG.info("Task: [" + i.getId() + "] still running.");     
           return true;
         }
        }
      }
    }
    
    return false;
  }
  
  @VisibleForTesting 
  protected List<WorkflowInstance> filterInstances(List<WorkflowInstance> instances, String taskId){
    List<WorkflowInstance> insts = new ArrayList<>();
    if(instances!=null && instances.size()>0){
        for(WorkflowInstance instance:instances){
            if(instance.getCurrentTask().getTaskId().equals(taskId)){
                LOG.info("Adding "+taskId+" instance: [" + instance.getCurrentTask().getTaskId() + "]");
                insts.add(instance);
            }else{
                LOG.info("Filtering task: [" + instance.getCurrentTask().getTaskId() + "]");
            }
        }
    }
    return insts;
  }  
  

  @VisibleForTesting
  protected boolean isRunning(String status) {
    List<String> runningStates = Arrays.asList("CREATED", "QUEUED", "STARTED",
        "RSUBMIT", "PGE EXEC", "STAGING INPUT", "CRAWLING");
    List<String> finishedStates = Arrays.asList("PAUSED", "METMISS",
        "FINISHED");
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

  private synchronized String execToString(String command) throws Exception {
    ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
    CommandLine commandline = CommandLine.parse(command);
    DefaultExecutor exec = new DefaultExecutor();
    PumpStreamHandler streamHandler = new PumpStreamHandler(outputStream);
    int status = -1;
    exec.setStreamHandler(streamHandler);
    status = exec.execute(commandline);
    String output = outputStream.toString(Charset.defaultCharset().name());
    if (status != 0) {
      throw new IOException("Non-zero status message from executing: ["
          + command + "]: output: [" + output + "]");
    }
    return output;
  }

  private synchronized void wipeProductType(String productTypeName) {
    DeleteProduct dp = new DeleteProduct(this.fm.getFmUrl().toString(), true);
    ProductType type = this.fm.safeGetProductTypeByName(productTypeName);
    if (type == null) {
      LOG.warning("Unable to get product type definition for: ["
          + productTypeName + "]: FM wipe fails.");
      return;
    }
    LOG.info("Paging through products for product type: " + productTypeName);
    ProductPage page = this.fm.safeFirstPage(type);

    while (page != null) {
      LOG.info("Cleaning File Manager: Product Type: [" + productTypeName
          + "]: wiping [" + String.valueOf(page.getTotalPages())
          + "] pages of products: pageSize: [" + page.getPageSize() + "].");
      for (Product product : page.getPageProducts()) {
        dp.remove(product.getProductId());
      }

      if (page.isLastPage()) {
        break;
      }
      try {
        page = this.fm.getFmgrClient().getNextPage(type, page);
      } catch (Exception e) {
        e.printStackTrace();
        LOG.warning("Unable to obtain next page. Message: "
            + e.getLocalizedMessage() + " breaking loop.");
        break;
      }
    }

  }

  private String parseAsVersionControlledRepo()
          throws IOException {
    String projectName = null;
    boolean git = urlLoc.endsWith(".git");
    String line = null;
    if (git) {
           line = "git clone --depth 1 --branch master " + urlLoc;
    } else {
      projectName = urlLoc.substring(urlLoc.lastIndexOf("/") + 1);
      line = "svn export " + urlLoc;
    }
    String clonePath = this.path;
    File cloneDir = new File(clonePath);
    LOG.info("Cloning Git / SVN project: [" + projectName + "] remote repo: ["
            + this.urlLoc + "] into " + this.path);

    CommandLine cmdLine = CommandLine.parse(line);
    DefaultExecutor executor = new DefaultExecutor();
    executor.setWorkingDirectory(new File(this.path));
    int exitValue = executor.execute(cmdLine);

    if (git) {
      String gitHiddenDirPath = clonePath + File.separator + ".git";
      File gitHiddenDir = new File(gitHiddenDirPath);
      LOG.info("Removing .git directory from " + gitHiddenDirPath);
      org.apache.cxf.helpers.FileUtils.removeDir(gitHiddenDir);
    }

    return clonePath;

  }

  private synchronized void wipeInstanceRepo(String wmUrl) {
    XmlRpcWorkflowManagerClient wm;
    try {
      wm = new XmlRpcWorkflowManagerClient(new URL(wmUrl));
      wm.clearWorkflowInstances();
    } catch (Exception e) {
      e.printStackTrace();
      LOG.warning("DRAT: reset: error communicating with the WM. Message: "
          + e.getLocalizedMessage());
    }
  }

  private synchronized void wipeSolrCore(String coreName) {
    String baseUrl = "http://localhost:8080/solr";
    String finalUrl = baseUrl + "/" + coreName;
    CommonsHttpSolrServer server = null;
    try {
      server = new CommonsHttpSolrServer(finalUrl);
      server.deleteByQuery("*:*");
      server.commit();
    } catch (Exception e) {
      e.printStackTrace();
      LOG.warning("Error wiping Solr core: [" + coreName + "]: Message: "
          + e.getLocalizedMessage());
    }
  }
  
  private class DratLog{
      private static final String MODULE = "DRAT_LOG";
      long startTime =0;
      private long lastActionTime=-1L;
      private long timeDiff  =-1L;
      private ZonedDateTime zdt;
      private String action;
      public DratLog(String action) {
          this.action = action;
          
      }
      
      private void logWarning(String status,String desc) {
          LOG.warning(getMsg(status,desc));
      }
      
      private void logWarning(String desc) {
          LOG.warning(MODULE+" : "+desc);
      }
      
      private void logInfo(String status,String desc) {
          LOG.info(getMsg(status,desc));
      }
      
      private void logInfo(String desc) {
          LOG.info(MODULE+" : "+desc);
      }
      
      private void logSevere(String status,String desc) {
          LOG.fine(getMsg(status,desc));
      }
      
      private String getMsg(String status,String desc) {
          String basic = "";
          if(startTime==0) {
              startTime = System.currentTimeMillis();
              zdt = ZonedDateTime.ofInstant(Instant.ofEpochMilli(startTime), ZoneId.systemDefault());
              basic = String.format("%1$s : %2$s : %3$s, at time %4$s", MODULE,action,status,
                      zdt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME));
          }else {
              lastActionTime = System.currentTimeMillis();
              timeDiff = lastActionTime - startTime;
              zdt = ZonedDateTime.ofInstant(Instant.ofEpochMilli(startTime), ZoneId.systemDefault());
              basic =  String.format("%1$s : %2$s : %3$s, at time %4$s with duration %5$s", MODULE,action,status,
                      zdt.format(DateTimeFormatter.ISO_OFFSET_DATE_TIME),DurationFormatUtils.formatDuration(timeDiff,"MM-dd T HH-mm-ss"));
          }
          
          if(desc==null) {
              return basic;
          }else {
              return String.format("%1$s : %2$s", basic,desc);
          }
      }
      
      
  }

}
