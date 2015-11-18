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
    public DratStartForm(String name, FileUploadField fileUploader, TextField<String> path) {
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
            if(pathValue == null || pathValue.isEmpty()) {
                File file = new File(System.getProperty("java.io.tmpdir") + File.separator + fileUpload.getClientFileName());
                fileUpload.writeTo(file);
                File unzippedFile = Unzipper.unzip(file);
                file.delete();
                startDrat(unzippedFile.getCanonicalPath(), "GO");
            }
            if(pathValue.startsWith("http://")) {
                parseAsVersionControlledRepo(pathValue);
            }
            else {
                try {
                    File file = new File(pathValue);
                    if(file.exists()) {
                        startDrat(pathValue, "GO");
                    }
                    else {
                        setResponsePage(HomePage.class);
                        return;
                    }
                }
                catch(Exception e) {
                    e.printStackTrace();
                    setResponsePage(HomePage.class);
                }
            }
            setResponsePage(DratWorkflow.class);
        }
        catch(Exception e) {
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

