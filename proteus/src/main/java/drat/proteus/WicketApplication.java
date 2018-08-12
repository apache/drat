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

package drat.proteus;

import java.util.HashMap;
import java.util.HashSet;
import java.util.Map;
import java.util.Set;
import java.util.logging.Level;
import java.util.logging.Logger;
import java.util.regex.Pattern;

import drat.proteus.filemgr.rest.FileManagerProgressResponse;
import drat.proteus.filemgr.rest.FileManagerRestResource;
import drat.proteus.rest.DratRestResource;
import drat.proteus.rest.ServicesRestResource;
import drat.proteus.workflow.rest.WorkflowRestResource;

import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.protocol.http.WebApplication;
import org.apache.wicket.request.resource.IResource;
import org.apache.wicket.request.resource.PackageResourceReference;
import org.apache.wicket.request.resource.ResourceReference;
import org.apache.wicket.util.file.File;
import org.reflections.Reflections;
import org.reflections.scanners.ResourcesScanner;

/**
 * Application object for your web application. If you want to run this
 * application without deploying, run the Start class.
 *
 */
public class WicketApplication extends WebApplication {

  private Logger LOG = Logger.getLogger(WicketApplication.class.getName());

  @Override
  public Class<? extends WebPage> getHomePage() {
    return HomePage.class;
  }

  /**
   * @see org.apache.wicket.Application#init()
   */
  @Override
  public void init() {
    super.init();
    mountResource("/drat", new ResourceReference("restReference") {
      DratRestResource resource = new DratRestResource();

      @Override
      public IResource getResource() {
        return resource;
      }
    });
    mountResource("/service", new ResourceReference("restReference") {
      ServicesRestResource resource = new ServicesRestResource();

      @Override
      public IResource getResource() {
        return resource;
      }
    });
    
    mountResource("/workflowservice",new ResourceReference("restReference"){
        WorkflowRestResource resource = new WorkflowRestResource();
        @Override
        public IResource getResource() {
          return resource;
        }
    });
    mountResource("/filemanager", new ResourceReference("restReference") {
      @Override
      public IResource getResource() {
        return new FileManagerRestResource();
      }
    });
    mountPage("/workflow", DratWorkflow.class);

    doImageMounts(
        getImageFiles(WicketApplication.class.getPackage().getName()),
        (Class<?>) HomePage.class);
  }

  private void doImageMounts(Set<String> resources, Class<?> clazz) {
    if (resources != null) {
      for (String resource : resources) {
        String resName = new File(resource).getName();
        String resPath = "/images/" + resName;
        LOG.log(Level.INFO, "Mounting: [" + resPath + "] origName: [" + resName
            + "]: resource: [" + resource + "]");
        PackageResourceReference imgRef = new PackageResourceReference(
            getClass(), resName);
        mountResource(resPath, imgRef);
      }
    }
  }

  private Set<String> getImageFiles(String packageName) {
    Pattern pattern = Pattern.compile(".*\\.(png|gif|jpg|jpeg|jp2)");
    Set<String> resources = new Reflections(packageName, new ResourcesScanner())
        .getResources(pattern);
    Set<String> filteredResources = new HashSet<String>();
    Map<String, Boolean> resMap = new HashMap<String, Boolean>();
    for (String res : resources) {
      String resName = new File(res).getName();
      if (!resMap.containsKey(resName)) {
        resMap.put(resName, true);
        filteredResources.add(resName);
      }
    }

    return filteredResources;
  }
}
