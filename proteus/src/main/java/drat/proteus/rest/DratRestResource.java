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

import backend.*;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestBody;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class DratRestResource extends GsonRestResource {

  public AbstractOodtWrapper oodtWrapper;
  public AbstractDratWrapper dratWrapper;

  public DratRestResource() {
    oodtWrapper = ProcessOodtWrapper.getInstance();
    dratWrapper = ProcessDratWrapper.getInstance();
  }

  @MethodMapping(value = "/go", httpMethod = HttpMethod.POST)
  public void go(@RequestBody DratRequestWrapper body) throws Exception {
    dratWrapper.setIndexablePath(body.dirPath);
    dratWrapper.go();
  }

  @MethodMapping(value = "/index", httpMethod = HttpMethod.POST)
  public void index(@RequestBody DratRequestWrapper body) throws Exception {
    dratWrapper.setIndexablePath(body.dirPath);
    dratWrapper.index();
  }

  @MethodMapping(value = "/crawl", httpMethod = HttpMethod.POST)
  public void crawl(@RequestBody DratRequestWrapper body) throws Exception {
    dratWrapper.setIndexablePath(body.dirPath);
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
