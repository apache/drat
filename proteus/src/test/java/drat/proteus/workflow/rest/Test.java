package drat.proteus.workflow.rest;

import java.util.ArrayList;

import com.google.gson.Gson;

public class Test {
  public static void main(String[] args) {
      DynamicWorkflowRequestWrapper rapper = new DynamicWorkflowRequestWrapper();
      rapper.taskIds = new ArrayList<>();
      rapper.taskIds.add("urn:drat:something");
      Gson gson = new Gson();
      System.out.println(gson.toJson(rapper));
}

}
