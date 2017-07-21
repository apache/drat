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

package drat.proteus.services.general;

import javax.ws.rs.client.Client;
import javax.ws.rs.client.ClientBuilder;
import java.util.Map;
import java.util.logging.Logger;

public abstract class RequestEmitter {
  private static Client client = ClientBuilder.newBuilder().newClient();
  private String serviceName;
  private static final Logger LOG = Logger.getLogger(RequestEmitter.class.getName());

  public RequestEmitter(String serviceName) {
    this.serviceName = serviceName;
  }

  public RestRequest createRequest(String path) {
    RestRequest request = new RestRequest(client);
    request.buildTarget(this.serviceName, path);
    return request;
  }

  public RestRequest createRequest(String path, Map<String, String> queryParams) {
    RestRequest request = new RestRequest(client);
    request.buildTarget(this.serviceName, path, queryParams);
    LOG.warning("REST request: class: ["+this.getClass().getName()+"]: URL: ["+request.getTarget().getUri().toString()+"]");
    return request;
  }

  public void destroy() {
    client.close();
  }
}