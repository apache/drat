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

import drat.proteus.rest.DratRequestWrapper;

/**
 * This interface abstracts the main communication methods between Apache DRAT
 * and Proteus
 */
public interface AbstractDratWrapper {
  public void crawl() throws Exception;

  public void index() throws Exception;

  public void map() throws Exception;

  public void reduce() throws Exception;

  public void go() throws Exception;

  public void reset() throws Exception;

  public void setIndexablePath(String path);

  public String getIndexablePath();
  
  void setData(DratRequestWrapper body);
}
