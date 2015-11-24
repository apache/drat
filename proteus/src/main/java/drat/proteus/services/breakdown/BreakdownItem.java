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

package drat.proteus.services.breakdown;

import drat.proteus.services.general.Item;

public class BreakdownItem extends Item {
  private String type;
  private int numberOfObjects;
  private transient int totalSize;
  private double weight;

  public BreakdownItem(String type, int numObjs) {
    this.type = type;
    this.numberOfObjects = numObjs;
  }

  public BreakdownItem(String type, int numObjs, int repoSize) {
    this(type, numObjs);
    this.totalSize = repoSize;
    setBreakdown();
  }

  public double getBreakdown() {
    return this.weight;
  }

  public void setRepoSize(int repoSize) {
    this.totalSize = repoSize;
    setBreakdown();
  }

  public int getNumberOfObjects() {
    return this.numberOfObjects;
  }

  public String getType() {
    return type;
  }

  private void setBreakdown() {
    this.weight = this.numberOfObjects * 1.0 / this.totalSize;
  }
}
