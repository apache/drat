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

import java.io.File;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
import java.util.logging.Logger;

import org.apache.commons.io.FileUtils;
import org.apache.commons.io.filefilter.FileFilterUtils;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestParam;
import org.wicketstuff.rest.contenthandling.json.webserialdeserial.GsonWebSerialDeserial;
import org.wicketstuff.rest.resource.AbstractRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import com.google.gson.Gson;
import com.google.gson.GsonBuilder;

import backend.FileConstants;
import drat.proteus.services.general.Item;
import drat.proteus.services.health.HealthMonitorService;
import drat.proteus.services.licenses.RatInstanceService;
import drat.proteus.services.mimetype.MimeTypeBreakdownService;
import drat.proteus.services.product.RecentProductService;

public class ServicesRestResource
    extends AbstractRestResource<GsonWebSerialDeserial> {

  private static final long serialVersionUID = -963632756412793830L;
  private static final Logger LOG = Logger
      .getLogger(ServicesRestResource.class.getName());
  private RecentProductService productService;
  private HealthMonitorService healthMonitorService;
  private MimeTypeBreakdownService mimeTypeBreakdownService;
  private RatInstanceService ratInstanceService;

  public ServicesRestResource() {
    super(new GsonWebSerialDeserial());
    productService = new RecentProductService();
    healthMonitorService = new HealthMonitorService();
    mimeTypeBreakdownService = new MimeTypeBreakdownService();
    ratInstanceService = new RatInstanceService();
  }

  @MethodMapping(value = "/repo/licenses/unapproved", httpMethod = HttpMethod.GET)
  public List<Item> getUnapprovedLicensesFromRatInstances() {
    List<Item> licenses = new ArrayList<Item>();
    try {
      ratInstanceService.getRatLogs();
      licenses = ratInstanceService.getUnapprovedLicenses();
    } catch (Exception e) {
      e.printStackTrace();
      LOG.warning("Error obtaining unapproved licenses from RAT: Message: "
          + e.getLocalizedMessage());
    }

    return licenses;
  }

  @MethodMapping(value = "/products", httpMethod = HttpMethod.GET)
  public List<Item> getRecentProducts() {
    return productService.getAllRecentProducts();
  }

  @MethodMapping(value = "/repo/breakdown/mime", httpMethod = HttpMethod.GET)
  public List<Item> getRepoMimeTypeBreakdown(
      @RequestParam(value = "limit", required = false) Integer limit) {
    if (limit == null) {
      limit = 0;
    }
    return mimeTypeBreakdownService.getMimeTypes(limit);
  }

  @MethodMapping(value = "/repo/breakdown/license", httpMethod = HttpMethod.GET)
  public List<Item> getRepoLicenseTypeBreakdown() {
    List<Item> breakdown = new ArrayList<Item>();
    try {
      ratInstanceService.getRatLogs();
      breakdown = ratInstanceService.getLicenseTypeBreakdown();
    } catch (Exception e) {
      e.printStackTrace();
      LOG.warning("Unable to get repo license type breakdown: Message: "
          + e.getLocalizedMessage());
    }

    return breakdown;
  }

  @MethodMapping(value = "/repo/size", httpMethod = HttpMethod.GET)
  public Map<String, Long> getRepositorySize(
      @RequestParam(value = "dir", required = false, defaultValue = "NOTPROVIDED") String repoPath) {
    if (repoPath.equals("NOTPROVIDED")) {
      repoPath = FileConstants.DRAT_TEMP_UNZIPPED_PATH;
    }

    File repoDir = new File(repoPath);
    long repoSize = 0;
    long numFiles = 0;
    if (repoDir.exists()) {
      repoSize = FileUtils.sizeOfDirectory(repoDir);
      numFiles = -1;
      Collection<File> repoFiles = FileUtils.listFiles(repoDir,
          FileFilterUtils.trueFileFilter(),
          FileFilterUtils.directoryFileFilter());
      if (repoFiles != null && repoFiles.size() > 0) {
        numFiles = repoFiles.size();
      } else
        numFiles = 0;
    }

    Map<String, Long> repoSizeInfo = new ConcurrentHashMap<String, Long>();
    repoSizeInfo.put("numberOfFiles", numFiles);
    repoSizeInfo.put("memorySize", repoSize);
    return repoSizeInfo;
  }

  @MethodMapping(value = "/status/drat", httpMethod = HttpMethod.GET)
  public String getDratRunningStatus() {
    return healthMonitorService.getDratStatus().toUpperCase();
  }

  @MethodMapping(value = "/status/oodt", httpMethod = HttpMethod.GET)
  public boolean getOodtRunningStatus() {
    return healthMonitorService.getOodtStatus();
  }

  @MethodMapping(value = "/status/oodt/raw", httpMethod = HttpMethod.GET)
  public Object getOodtRawHealthStatus() {
    String jsonBody = healthMonitorService.rerouteHealthMonitorData()
        .readEntity(String.class);
    GsonBuilder g = new GsonBuilder();
    g.serializeSpecialFloatingPointValues();
    Gson gson = g.create();
    Map<String, Object> status = null;
    try {
      status = gson.fromJson(jsonBody, Map.class);
      return status;
    } catch (Exception e) {
      LOG.warning(
          "Exception creating GSON object for OODT raw health. Message: "
              + e.getLocalizedMessage());
      status = new ConcurrentHashMap<String, Object>();
      return status;
    }
  }
}
