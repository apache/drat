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

import drat.proteus.services.constants.ProteusEndpointConstants;
import org.wicketstuff.rest.utils.http.HttpMethod;

import javax.ws.rs.client.*;
import javax.ws.rs.core.Response;
import java.util.Map;

public class RestRequest {
  private WebTarget target;
  private Client client;

  public RestRequest(Client client) {
    this.client = client;
  }

  public void buildTarget(String service, String path) {
    this.target = this.client.target(
        ProteusEndpointConstants.BASE_URL + service).path(path);

  }

  public WebTarget buildTarget(String service, String path,
      Map<String, String> queryParams) {
    buildTarget(service, path);
    for (String q : queryParams.keySet()) {
      this.target = this.target.queryParam(q, queryParams.get(q));
    }
    return target;
  }

  public RestRequest addQueryParam(String key, Object... value) {
    this.target = this.target.queryParam(key, value);
    return this;
  }

  public Response getResponse(HttpMethod method) {
    Invocation.Builder builder = this.target.request();
    switch (method) {
    case GET: {
      return builder.get();
    }
    case HEAD: {
      return builder.head();
    }
    case DELETE: {
      return builder.delete();
    }
    default: {
      throw new IllegalStateException();
    }
    }
  }

  public Response getResponse(HttpMethod method, Entity entity) {
    Invocation.Builder builder = target.request();
    switch (method) {
    case PUT: {
      return builder.put(entity);
    }
    case POST: {
      return builder.post(entity);
    }
    default: {
      throw new IllegalStateException();
    }
    }
  }
  
  WebTarget getTarget(){
    return this.target;
  }
}
