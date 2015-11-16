package drat.proteus;
import drat.proteus.rest.Unzipper;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;

import java.io.File;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;
    private FileUploadField fileUploadField;
	public HomePage() {
	    fileUploadField = new FileUploadField("fileUploader");

        Form form = new Form("form") {
            @Override
            protected void onSubmit() {
                super.onSubmit();
                FileUpload fileUpload = fileUploadField.getFileUpload();
                try {
                    File file = new File(System.getProperty("java.nio.tempdir") + File.pathSeparator + fileUpload.getClientFileName());
                    fileUpload.writeTo(file);
                    File unzippedFile = Unzipper.unzip(file);
                    startDrat(unzippedFile.getCanonicalPath(), "GO");
                    setResponsePage(DratWorkflow.class);
                }
                catch(Exception e) {
                    e.printStackTrace();
                }
            }
        };
        form.add(fileUploadField);
        add(form);

    }

    public void startDrat(String filePath, String command) {
        Thread dratStarterRunnable = new Thread(new DratRunnable(filePath, command));
        dratStarterRunnable.start();
    }
}
