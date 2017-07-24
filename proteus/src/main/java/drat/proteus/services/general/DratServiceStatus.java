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

public class DratServiceStatus extends ServiceStatus {
  public enum State {
    INDEX, CRAWL, MAP, REDUCE, IDLE, INTERRUPTED
  }

  private State currentState;
  private int progress;

  public DratServiceStatus() {
    super(false); // since the status is a static variable, DRAT hasn't started
                  // yet
    this.currentState = State.IDLE;
  }

  public State getCurrentState() {
    return currentState;
  }

  public synchronized void setCurrentState(State status) {
    this.currentState = status;
    super.isRunning(currentState != State.IDLE
        && currentState != State.INTERRUPTED);
  }

  public int getProgress() {
    return progress;
  }

  public synchronized void setProgress(int progress) {
    this.progress = progress;
  }

}
