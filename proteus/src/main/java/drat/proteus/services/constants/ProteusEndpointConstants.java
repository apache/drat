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

package drat.proteus.services.constants;

public class ProteusEndpointConstants {
  public static final String BASE_URL = "http://localhost:8080";
  public static final String FILE_MANAGER_PRODUCTS = "viewRecent";
  public static final String HEALTH_STATUS_REPORT = "report";
  public static final String MIME_TYPE_SELECT = "select";

  public static class Services {
    public static final String MIME_TYPE_BREAKDOWN = "/solr/drat";
    public static final String FILE_MANAGER_PRODUCT = "/opsui";
    public static final String HEALTH_MONITOR = "/pcs/services/health";
    public static final String RAT_INSTANCES_MONITOR = "/opsui/instances";
  }
}
