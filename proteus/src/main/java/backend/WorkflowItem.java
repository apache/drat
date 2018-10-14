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

import org.apache.oodt.cas.workflow.structs.Workflow;
import org.apache.oodt.cas.workflow.structs.WorkflowInstance;
import org.apache.oodt.cas.workflow.structs.WorkflowTask;

public class WorkflowItem {

  private String id;
  private String status;
  private String currentTask;
  private String workflowName;
  private String wallClockTime;
  private String currentTaskWallClock;
  
  
  /**
   * 
   */
  public WorkflowItem() {
    super();
    this.id = null;
    this.status = null;
    this.currentTask = null;
    this.workflowName = null;
    this.wallClockTime = null;
    this.currentTaskWallClock = null;
  }


  /**
   * @param id
   * @param status
   * @param currentTask
   * @param workflowName
   * @param wallClockTime
   * @param currentTaskWallClock
   */
  public WorkflowItem(String id, String status, String currentTask,
      String workflowName, String wallClockTime, String currentTaskWallClock) {
    super();
    this.id = id;
    this.status = status;
    this.currentTask = currentTask;
    this.workflowName = workflowName;
    this.wallClockTime = wallClockTime;
    this.currentTaskWallClock = currentTaskWallClock;
  }


  /**
   * @return the id
   */
  public String getId() {
    return id;
  }


  /**
   * @param id the id to set
   */
  public void setId(String id) {
    this.id = id;
  }


  /**
   * @return the status
   */
  public String getStatus() {
    return status;
  }


  /**
   * @param status the status to set
   */
  public void setStatus(String status) {
    this.status = status;
  }


  /**
   * @return the currentTask
   */
  public String getCurrentTask() {
    return currentTask;
  }


  /**
   * @param currentTask the currentTask to set
   */
  public void setCurrentTask(String currentTask) {
    this.currentTask = currentTask;
  }


  /**
   * @return the workflowName
   */
  public String getWorkflowName() {
    return workflowName;
  }


  /**
   * @param workflowName the workflowName to set
   */
  public void setWorkflowName(String workflowName) {
    this.workflowName = workflowName;
  }


  /**
   * @return the wallClockTime
   */
  public String getWallClockTime() {
    return wallClockTime;
  }


  /**
   * @param wallClockTime the wallClockTime to set
   */
  public void setWallClockTime(String wallClockTime) {
    this.wallClockTime = wallClockTime;
  }


  /**
   * @return the currentTaskWallClock
   */
  public String getCurrentTaskWallClock() {
    return currentTaskWallClock;
  }


  /**
   * @param currentTaskWallClock the currentTaskWallClock to set
   */
  public void setCurrentTaskWallClock(String currentTaskWallClock) {
    this.currentTaskWallClock = currentTaskWallClock;
  }


  /* (non-Javadoc)
   * @see java.lang.Object#toString()
   */
  @Override
  public String toString() {
    return "WorkflowItem [id=" + id + ", status=" + status + ", currentTask="
        + currentTask + ", workflowName=" + workflowName + ", wallClockTime="
        + wallClockTime + ", currentTaskWallClock=" + currentTaskWallClock
        + "]";
  }
  
  public WorkflowInstance toInstance() {
    WorkflowInstance i = new WorkflowInstance();
    i.setId(this.id);
    i.setStatus(this.status);
    i.setCurrentTaskId(this.currentTask);
    WorkflowTask task = new WorkflowTask();
    task.setTaskId(this.currentTask);
    Workflow w = new Workflow();
    w.getTasks().add(task);
    w.setName(this.workflowName);
    i.setWorkflow(w);;
    return i;
  }

}
