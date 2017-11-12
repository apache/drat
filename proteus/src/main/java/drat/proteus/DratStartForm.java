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
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.SubmitLink;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;
import org.apache.wicket.markup.html.list.ListItem;
import org.apache.wicket.markup.html.list.ListView;
import org.apache.wicket.request.mapper.parameter.PageParameters;

import backend.ProcessDratWrapper;

import java.io.File;
import java.io.IOException;
import java.util.Arrays;
import java.util.List;
import java.util.logging.Logger;

/**
 * Sets up a DRAT run based on the Proteus start form.
 *
 */
public class DratStartForm extends Form {
  private static final Logger LOG = Logger
      .getLogger(DratStartForm.class.getName());
  private FileUploadField fileUploadField;
  private TextField<String> pathField;
  private ListView<String> cmdSelect;
  private String theCommand = null;

  public DratStartForm(String name, FileUploadField fileUploader,
      TextField<String> path) {
    super(name);
    fileUploadField = fileUploader;
    pathField = path;
    String[] cmdArray = { "Crawl", "Index", "Map", "Reduce", "Go", "Reset" };
    List<String> commands = (List<String>) Arrays.asList(cmdArray);
    cmdSelect = new ListView<String>("cmd", commands) {
      @Override
      protected void populateItem(final ListItem<String> item) {
        final String cmdItemLabel = item.getModelObject();
        SubmitLink link = new SubmitLink("cmd_link") {
          @Override
          public void onSubmit() {
            theCommand = cmdItemLabel;
          }
        };

        link.add(new Label("cmd_item_label", cmdItemLabel));
        item.add(link);

      }
    };
    this.add(fileUploadField);
    this.add(path);
    this.add(cmdSelect);
  }

  @Override
  protected void onSubmit() {
    super.onSubmit();
    if (theCommand != null) {
      handleSubmit(theCommand);
    } else
      handleSubmit("GO");
  }

  private void handleSubmit(String command) {
    FileUpload fileUpload = fileUploadField.getFileUpload();
    String uCommand = command.toUpperCase();
    boolean downloadPhase = uCommand.equals("GO") || uCommand.equals("CRAWL");

    try {
      String pathValue = pathField.getModelObject();
      if (!uCommand.equals("RESET")) {
        LOG.info(
            "Running DRAT: [" + uCommand + "] on path: [" + pathValue + "]");
        if (pathValue == null || pathValue.isEmpty()) {
          File file = new File(System.getProperty("java.io.tmpdir")
              + File.separator + fileUpload.getClientFileName());
          if (downloadPhase) {
            fileUpload.writeTo(file);
            File unzippedFile = Unzipper.unzip(file);
            file.delete();
            String unzipPath = unzippedFile.getCanonicalPath();
            startDrat(unzipPath, command);
            PageParameters params = new PageParameters();
            params.add("repoPath", unzipPath);
            setResponsePage(DratWorkflow.class, params);
            return;
          } else {
            LOG.info(
                "Omitting uploading of zip: current phase: [" + command + "]");
            String dratPath = file.getAbsolutePath();
            startDrat(dratPath, command);
            PageParameters params = new PageParameters();
            params.add("repoPath", dratPath);
            setResponsePage(DratWorkflow.class, params);
            return;
          }
        }

        if (pathValue.startsWith("http://") || pathValue.startsWith("https://")) {
          String clonePath = parseAsVersionControlledRepo(pathValue, command);
          if (!downloadPhase) {
            startDrat(pathValue, command);
          } else {
            startDrat(clonePath, command);
          }

          PageParameters params = new PageParameters();
          params.add("repoPath", clonePath);
          setResponsePage(DratWorkflow.class, params);
        } else {
          try {
            File file = new File(pathValue);
            if (file.exists()) {
              startDrat(pathValue, command);
            } else {
              PageParameters params = new PageParameters();
              setResponsePage(HomePage.class, params);
              return;
            }
          } catch (Exception e) {
            e.printStackTrace();
            PageParameters params = new PageParameters();
            setResponsePage(HomePage.class, params);
            return;
          }
        }
      } else {
        LOG.info("Running DRAT: reset.");
        // synchronous call so RESET is done when this returns.
        ProcessDratWrapper dratWrapper = ProcessDratWrapper.getInstance();
        dratWrapper.setIndexablePath(null);
        dratWrapper.reset();
        PageParameters params = new PageParameters();
        params.add("message", "DRAT reset completed successfully.");
        setResponsePage(HomePage.class, params);
      }

    } catch (Exception e) {
      e.printStackTrace();
      PageParameters params = new PageParameters();
      setResponsePage(HomePage.class, params);
    }

  }

  private void startDrat(String filePath, String command) {
    Thread dratStarterRunnable = new Thread(
        new DratRunnable(filePath, command));
    dratStarterRunnable.start();
  }

  private String parseAsVersionControlledRepo(String path, String command)
      throws IOException {
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
      LOG.info(
          "Git / SVN clone: [" + clonePath + "] already exists, removing it.");
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

    return clonePath;

  }
}
