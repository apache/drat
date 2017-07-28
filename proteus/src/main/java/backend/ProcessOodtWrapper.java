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

import drat.proteus.services.health.HealthMonitorService;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class ProcessOodtWrapper extends GenericProcess implements
    AbstractOodtWrapper {
  private static final String OODT = FileConstants.OODT_PATH;
  private HealthMonitorService healthMonitorService;
  private static ProcessOodtWrapper singletonOodtWrapper = new ProcessOodtWrapper();

  public static ProcessOodtWrapper getInstance() {
    return singletonOodtWrapper;
  }

  private ProcessOodtWrapper() {
    super(OODT);
    healthMonitorService = new HealthMonitorService();
  }

  public void run() throws IOException {
    super.createProcess("start");
  }

  public void stop() throws IOException {
    super.createProcess("stop");
  }

  public boolean isRunning() {
    return healthMonitorService.getOodtStatus();
  }
}
