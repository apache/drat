package drat.proteus;

import drat.proteus.rest.Unzipper;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;

import java.io.File;

/**
 * Created by stevenfrancus on 11/16/15.
 */
public class DratStartForm extends Form {
    private FileUploadField fileUploadField;
    public DratStartForm(String name, FileUploadField fileUploader) {
        super(name);
        fileUploadField = fileUploader;
        this.add(fileUploadField);
    }
    @Override
    protected void onSubmit() {
        super.onSubmit();
        FileUpload fileUpload = fileUploadField.getFileUpload();
        try {
            File file = new File(System.getProperty("java.io.tmpdir") + File.separator + fileUpload.getClientFileName());
            System.out.println(file.getCanonicalPath());
            fileUpload.writeTo(file);
            File unzippedFile = Unzipper.unzip(file);
            file.delete();
            startDrat(unzippedFile.getCanonicalPath(), "GO");
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
}
