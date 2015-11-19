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

package drat.proteus.services.health;

import backend.ProcessDratWrapper;
import com.google.gson.Gson;
import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.*;
//import org.apache.oodt.cas.filemgr.system.XmlRpcFileManagerClient;
import org.wicketstuff.rest.utils.http.HttpMethod;

import javax.ws.rs.core.Response;
import java.net.MalformedURLException;
import java.net.URISyntaxException;
import java.net.URL;
import java.util.Map;

public class HealthMonitorService extends AbstractRestService {
  private static final String FM_URL = "http://localhost:9000";
  private static final String FM_GENERIC_FILE = "GenericFile";

  private static final String DAEMON = "daemon";
  private static final String DAEMON_OK_STATUS = "UP";
  private static final String URL = "url";
  private static final String STATUS = "status";

  private static final String FILE_MGR_ABBR = "fm";
  private static final String WORK_MGR_ABBR = "wm";
  private static final String RES_MGR_ABBR = "rm";

  private static final String SPECIFIC_DAEMON_STATUS = ProteusEndpointConstants.HEALTH_STATUS_REPORT
      + "/daemon/";
  private static final String DAEMON_FILE_MGR = SPECIFIC_DAEMON_STATUS
      + FILE_MGR_ABBR;
  private static final String DAEMON_WORK_MGR = SPECIFIC_DAEMON_STATUS
      + WORK_MGR_ABBR;
  private static final String DAEMON_RES_MGR = SPECIFIC_DAEMON_STATUS
      + RES_MGR_ABBR;

  // private XmlRpcFileManagerClient fmClient;

  private ProcessDratWrapper dratWrapper;

  public HealthMonitorService() {
    super(ProteusEndpointConstants.Services.HEALTH_MONITOR);
    dratWrapper = ProcessDratWrapper.getInstance();
    /*
     * try { fmClient = new XmlRpcFileManagerClient(new java.net.URL(FM_URL)); }
     * catch(Exception mue) { mue.printStackTrace(); }
     */
  }

  // Simple function to make a JAX-RS call to the OODT PCS-Health service and
  // route it to /proteus/service/health instead
  public Response rerouteHealthMonitorData() {
    Response response;
    try {
      response = this.createRequest(
          ProteusEndpointConstants.HEALTH_STATUS_REPORT).getResponse(
          HttpMethod.GET);
    } catch (Exception e) {
      response = Response.serverError().build();
      // if response has an exception, let's assume that OODT cannot be accessed
      // (aka it's been stopped/not started)
    }
    return response;
  }

  public DratServiceStatus getDratStatus() {
    DratServiceStatus currentState = dratWrapper.getDratStatus();
    int stageProgress = getCurrentProgress(currentState.getCurrentState());
    currentState.setProgress(stageProgress);
    return currentState;
  }

  public OodtServiceStatus getOodtStatus() {
    Response response = rerouteHealthMonitorData();
    if (response == null || response.getStatus() > 300) { // there was an error
                                                          // in the response,
                                                          // possibly caused by
                                                          // misconfig or OODT
                                                          // not being on
      return new OodtServiceStatus(false);
    }
    String jsonBody = response.readEntity(String.class);
    Map<String, Object> rawStatusOutput = new Gson().fromJson(jsonBody,
        Map.class);
    Map<String, Object> report = (Map<String, Object>) rawStatusOutput
        .get("report");
    Map<String, Object> daemonStatus = (Map<String, Object>) report
        .get("daemonStatus");
    HealthMonitorItem fileManager = (HealthMonitorItem) parseJsonMap((Map<String, Object>) daemonStatus
        .get(FILE_MGR_ABBR));
    HealthMonitorItem resManager = (HealthMonitorItem) parseJsonMap((Map<String, Object>) daemonStatus
        .get(RES_MGR_ABBR));
    HealthMonitorItem workflowManager = (HealthMonitorItem) parseJsonMap((Map<String, Object>) daemonStatus
        .get(WORK_MGR_ABBR));
    return new OodtServiceStatus(fileManager.isRunning()
        && resManager.isRunning() && workflowManager.isRunning());
  }

  public Item getFileManagerStatus() throws URISyntaxException {
    return getDaemonStatus(DAEMON_FILE_MGR);
  }

  public Item getResourceManagerStatus() throws URISyntaxException {
    return getDaemonStatus(DAEMON_RES_MGR);
  }

  public Item getWorkflowManagerStatus() throws URISyntaxException {
    return getDaemonStatus(DAEMON_WORK_MGR);
  }

  private Item getDaemonStatus(String daemonPath) throws URISyntaxException {
    Response response = this.createRequest(daemonPath).getResponse(
        HttpMethod.GET);
    String jsonBody = response.readEntity(String.class);
    Map<String, Object> daemonStatus = new Gson().fromJson(jsonBody, Map.class);
    return parseJsonMap(daemonStatus);
  }

  private Item parseJsonMap(Map<String, Object> daemonStatus) {
    try {
      boolean isRunning = (((String) daemonStatus.get(STATUS)).toUpperCase()
          .equals(DAEMON_OK_STATUS));
      return new HealthMonitorItem((String) daemonStatus.get(DAEMON),
          (String) daemonStatus.get(URL), isRunning);
    } catch (URISyntaxException urise) {
      urise.printStackTrace();
      return null; // this shouldn't happen unless PCS returns a broken link
    }
  }

  private int getCurrentProgress(DratServiceStatus.State state) {
    switch (state) {
    case CRAWL: {
      return getGenericFilesCrawled();
    }
    case INDEX: {
      return getSolrFileCount();
    }
    case MAP: {
      return 0;
    }
    case REDUCE: {
      return 0;
    }
    default: {
      return 0;
    }
    }
  }

  private int getGenericFilesCrawled() {
    int numIngestedFiles = 0;
    /*
     * try { // numIngestedFiles =
     * fmClient.getNumProducts(fmClient.getProductTypeByName(FM_GENERIC_FILE));
     * } catch(Exception e) { e.printStackTrace(); }
     */
    return numIngestedFiles;
  }

  private int getSolrFileCount() {
    return 0;
  }

}
