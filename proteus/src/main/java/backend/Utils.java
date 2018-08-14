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

import org.apache.oodt.cas.metadata.util.PathUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utils {
  private static Map<String, String> environment = new HashMap<String, String>();
  private static List<String> resetDratConstants = new ArrayList<String>();
  private static String resetRepoFile = null;
  static {
    environment.put("JAVA_HOME", PathUtils.replaceEnvVariables("[JAVA_HOME]"));
    environment.put("DRAT_HOME", PathUtils.replaceEnvVariables("[DRAT_HOME]"));
    environment.put("GANGLIA_URL",
        PathUtils.replaceEnvVariables("[GANGLIA_URL]"));

    buildEnvironmentVariables();

    String DRAT_HOME = environment.get("DRAT_HOME");
    resetDratConstants.add(DRAT_HOME + "/data/archive/");
    resetDratConstants.add(DRAT_HOME + "/data/jobs/");
  }

  public static Map<String, String> getEnvironment() {
    return environment;
  }

  public static List<String> getResetDirectories() {
    return resetDratConstants;
  }

  public static void buildEnvironmentVariables() {
    if (environment.get("JAVA_HOME") == null
        || environment.get("DRAT_HOME") == null
        || environment.get("GANGLIA_URL") == null) {
      throw new RuntimeException("Environment variables not set properly!");
    }
  }
}
