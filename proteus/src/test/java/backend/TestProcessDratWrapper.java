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

import java.util.ArrayList;
import java.util.List;
import org.apache.oodt.cas.workflow.structs.WorkflowInstance;
import backend.ProcessDratWrapper;
import static backend.ProcessDratWrapper.MAPPER_TASK_ID;
import static backend.ProcessDratWrapper.PARTITION_AND_MAP_TASK_ID;
import junit.framework.TestCase;

public class TestProcessDratWrapper extends TestCase {

  public void testParseWorkflows(){
    ProcessDratWrapper wrapper = ProcessDratWrapper.getInstance();
    assertNotNull(wrapper);
    String cmdLines =  "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=FINISHED, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]";
    
    List<WorkflowItem> items = null;
    items = wrapper.parseWorkflows(cmdLines);
    assertNotNull(items);
    assertEquals(2, items.size());
    assertTrue(items.get(1).getStatus().equals("PGE EXEC"));
  }
  
  public void testStillRunning(){
    ProcessDratWrapper wrapper = ProcessDratWrapper.getInstance();
    assertNotNull(wrapper);
    String cmdLines =  "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=FINISHED, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:RatCodeAudit, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]";
    
    List<WorkflowItem> items = null;
    items = wrapper.parseWorkflows(cmdLines);
    assertNotNull(items);
    List<WorkflowInstance> insts = new ArrayList<WorkflowInstance>(items.size());
    for(WorkflowItem wi: items) {
      insts.add(wi.toInstance());
    }
    assertTrue(wrapper.taskStillRunning(insts, PARTITION_AND_MAP_TASK_ID, MAPPER_TASK_ID)); 
  }

  public void testFilterPartitioners(){
    ProcessDratWrapper wrapper = ProcessDratWrapper.getInstance();
    assertNotNull(wrapper);
    String cmdLines =  "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=FINISHED, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:RatCodeAudit, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]";
    
    List<WorkflowItem> items = null;
    items = wrapper.parseWorkflows(cmdLines);
    assertNotNull(items);
    List<WorkflowInstance> insts = new ArrayList<WorkflowInstance>(items.size());
    for(WorkflowItem wi: items) {
      insts.add(wi.toInstance());
    }    
    List<WorkflowInstance> partitioners = null;
    partitioners = wrapper.filterInstances(insts, PARTITION_AND_MAP_TASK_ID);
    assertNotNull(partitioners);
    assertEquals(2, partitioners.size());    
  }
  
  public void testFilterMappers(){
    ProcessDratWrapper wrapper = ProcessDratWrapper.getInstance();
    assertNotNull(wrapper);
    String cmdLines =  "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=FINISHED, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:MimePartitioner, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]\n" + 
                            "Instance: [id=d3aed64f-6e7c-11e7-af03-cb83c51de744, status=PGE EXEC, currentTask=urn:drat:RatCodeAudit, workflow=Dynamic Workflow-6fc5fc4c-d27a-47f6-905c-2f2e99fa92e9,wallClockTime=0.13265,currentTaskWallClockTime=0.0]";
    
    List<WorkflowItem> items = null;
    items = wrapper.parseWorkflows(cmdLines);
    assertNotNull(items);
    List<WorkflowInstance> insts = new ArrayList<WorkflowInstance>(items.size());
    for(WorkflowItem wi: items) {
      insts.add(wi.toInstance());
    }    
    List<WorkflowInstance> mappers = null;
    mappers = wrapper.filterInstances(insts, MAPPER_TASK_ID);
    assertNotNull(mappers);
    assertEquals(1, mappers.size());    
  }
  
  public void testIsRunning(){
    ProcessDratWrapper wrapper = ProcessDratWrapper.getInstance();
    assertNotNull(wrapper);
    String shouldBeRunning = "PGE EXEC";
    String tricky = "RSUBMIT";
    String queued = "QUEUED";
    String finished = "FINISHED";
    
    assertTrue(wrapper.isRunning(shouldBeRunning));
    assertTrue(wrapper.isRunning(tricky));
    assertTrue(wrapper.isRunning(queued));
    assertFalse(wrapper.isRunning(finished));
    
  }
  
  

}
