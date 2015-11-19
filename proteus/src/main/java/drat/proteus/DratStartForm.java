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
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;

import java.io.File;

/**
 * Created by stevenfrancus on 11/16/15.
 */
public class DratStartForm extends Form {
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

  private void parseAsVersionControlledRepo(String path) {
    return;
  }
}
