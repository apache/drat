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

import java.util.logging.Logger;

import drat.proteus.services.general.DratServiceStatus;

public class DratProcessMonitor implements Runnable {
  private DratServiceStatus status;
  private Process proc;
  private String dratCmd;
  private static final Logger LOG = Logger.getLogger(DratProcessMonitor.class.getName());

  public DratProcessMonitor(DratServiceStatus status, Process dratRunningProcess, String dratCmd) {
    this.status = status;
    this.proc = dratRunningProcess;
    this.dratCmd = dratCmd;
  }

  @Override
  public void run() {
    LOG.info("Invoking and monitoring DRAT process: current status: ["+String.valueOf(this.status.getCurrentState())+"]: dratCmd: ["+dratCmd+"]");
    try {
      this.proc.waitFor();
      int exitValue = this.proc.exitValue();
      if (exitValue  == 0) {
        LOG.info("drat cmd: ["+this.dratCmd+"]: is complete,  process completed normally. exitValue:["+String.valueOf(exitValue)+"]");
        status.setCurrentState(DratServiceStatus.State.IDLE);
      } else {
        LOG.info("drat cmd: ["+this.dratCmd+"]: is complete, process dit not complete normally, exitValue:[ "+String.valueOf(exitValue)+"]: setting state to interrupted");
        status.setCurrentState(DratServiceStatus.State.INTERRUPTED);
      }
    } catch (InterruptedException ie) {
      ie.printStackTrace();
      LOG.info("drat cmd is interrupted. Message: "+ie.getMessage());
      status.setCurrentState(DratServiceStatus.State.INTERRUPTED);
    }
  }
}