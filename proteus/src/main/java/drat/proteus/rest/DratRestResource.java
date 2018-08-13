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

import java.io.*;
import java.nio.file.Files;
import java.nio.file.Paths;
import java.util.logging.Logger;

import com.google.gson.Gson;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestBody;
import org.wicketstuff.rest.contenthandling.json.webserialdeserial.GsonWebSerialDeserial;
import org.wicketstuff.rest.resource.AbstractRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;
import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.FileConstants;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;

public class DratRestResource extends AbstractRestResource<GsonWebSerialDeserial> {
  private static final Logger LOG = Logger.getLogger(DratRestResource.class.getName());
  private static final long serialVersionUID = -5885535059043262485L;
  public AbstractOodtWrapper oodtWrapper;
  public AbstractDratWrapper dratWrapper;

  public DratRestResource() {
    super(new GsonWebSerialDeserial());
    oodtWrapper = ProcessOodtWrapper.getInstance();
    dratWrapper = ProcessDratWrapper.getInstance();
  }

  @MethodMapping(value = "/go", httpMethod = HttpMethod.POST)
  public void go(@RequestBody DratRequestWrapper body) throws Exception {
    
    dratWrapper.setData(body);
    dratWrapper.setIndexablePath(body.repo);
    dratWrapper.go();
  }

  @MethodMapping(value = "/index", httpMethod = HttpMethod.POST)
  public void index(@RequestBody DratRequestWrapper body) throws Exception {
    dratWrapper.setData(body);
    dratWrapper.setIndexablePath(body.repo);
    dratWrapper.index();
  }

  @MethodMapping(value = "/crawl", httpMethod = HttpMethod.POST)
  public void crawl(@RequestBody DratRequestWrapper body) throws Exception {
    dratWrapper.setData(body);
    dratWrapper.setIndexablePath(body.repo);
    dratWrapper.crawl();
  }

  @MethodMapping(value = "/map", httpMethod = HttpMethod.POST)
  public void map() throws Exception {
    dratWrapper.map();
  }

  @MethodMapping(value = "/reduce", httpMethod = HttpMethod.POST)
  public void reduce() throws Exception {
    dratWrapper.reduce();
  }

  @MethodMapping(value = "/reset", httpMethod = HttpMethod.POST)
  public void reset() throws Exception {
    dratWrapper.reset();
  }
  
  @MethodMapping(value = "/currentrepo",httpMethod = HttpMethod.GET)
  public String currentRepo() throws Exception{
    return dratWrapper.getIndexablePath();
  }

  @MethodMapping(value = "/log", httpMethod = HttpMethod.GET)
  public String getProcessLog() {
    File log = new File(FileConstants.DRAT_TEMP_LOG_OUTPUT);
    if (log.exists()) {
      try {
        byte[] encoded = Files.readAllBytes(Paths.get(log.getAbsolutePath()));
        return new String(encoded);
      } catch (IOException ioe) {
        return ioe.getMessage();
      }
    } else {
      return "Log is empty!";
    }
  }
 
}
