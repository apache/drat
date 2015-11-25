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

import drat.proteus.rest.Unzipper;

import org.apache.commons.exec.CommandLine;
import org.apache.commons.exec.DefaultExecutor;
import org.apache.cxf.helpers.FileUtils;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;

import backend.GenericProcess;

import java.io.File;
import java.io.IOException;
import java.util.logging.Level;
import java.util.logging.Logger;

/**
 * Created by stevenfrancus on 11/16/15.
 */
public class DratStartForm extends Form {
  private static final Logger LOG = Logger.getLogger(DratStartForm.class
      .getName());
  private FileUploadField fileUploadField;
  private TextField<String> pathField;

  public DratStartForm(String name, FileUploadField fileUploader,
      TextField<String> path) {
    super(name);
    fileUploadField = fileUploader;
    pathField = path;
    this.add(fileUploadField);
    this.add(path);
  }

  @Override
  protected void onSubmit() {
    super.onSubmit();
    FileUpload fileUpload = fileUploadField.getFileUpload();
    try {
      String pathValue = pathField.getModelObject();
      if (pathValue == null || pathValue.isEmpty()) {
        File file = new File(System.getProperty("java.io.tmpdir")
            + File.separator + fileUpload.getClientFileName());
        fileUpload.writeTo(file);
        File unzippedFile = Unzipper.unzip(file);
        file.delete();
        startDrat(unzippedFile.getCanonicalPath(), "GO");
        setResponsePage(DratWorkflow.class);
      }
      if (pathValue.startsWith("http://")) {
        parseAsVersionControlledRepo(pathValue);
      } else {
        try {
          File file = new File(pathValue);
          if (file.exists()) {
            startDrat(pathValue, "GO");
          } else {
            setResponsePage(HomePage.class);
            return;
          }
        } catch (Exception e) {
          e.printStackTrace();
          setResponsePage(HomePage.class);
        }
      }
      setResponsePage(DratWorkflow.class);
    } catch (Exception e) {
      e.printStackTrace();
    }
  }

  private void startDrat(String filePath, String command) {
    Thread dratStarterRunnable = new Thread(new DratRunnable(filePath, command));
    dratStarterRunnable.start();
  }

  private void parseAsVersionControlledRepo(String path) throws IOException {
    String projectName = null;
    boolean git = path.endsWith(".git");
    File tmpDir = new File(System.getProperty("java.io.tmpdir"));
    String tmpDirPath = tmpDir.getCanonicalPath();
    String line = null;
    if (git) {
      projectName = path.substring(path.lastIndexOf("/") + 1,
          path.lastIndexOf("."));
      line = "git clone --depth 1 --branch master " + path;
    } else {
      projectName = path.substring(path.lastIndexOf("/") + 1);
      line = "svn export " + path;
    }    
    String clonePath = tmpDirPath + File.separator + projectName;
    File cloneDir = new File(clonePath);
    if (cloneDir.isDirectory() && cloneDir.exists()) {
      LOG.info("Git / SVN clone: [" + clonePath
          + "] already exists, removing it.");
      FileUtils.removeDir(cloneDir);
    }
    LOG.info("Cloning Git / SVN project: [" + projectName + "] remote repo: ["
        + path + "] into " + tmpDirPath);


    CommandLine cmdLine = CommandLine.parse(line);
    DefaultExecutor executor = new DefaultExecutor();
    executor.setWorkingDirectory(tmpDir);
    int exitValue = executor.execute(cmdLine);

    if (git) {
      String gitHiddenDirPath = clonePath + File.separator + ".git";
      File gitHiddenDir = new File(gitHiddenDirPath);
      LOG.info("Removing .git directory from " + gitHiddenDirPath);
      FileUtils.removeDir(gitHiddenDir);
    }

    startDrat(clonePath, "GO");

  }
}
