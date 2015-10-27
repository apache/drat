package drat.proteus;

import backend.AbstractOodtWrapper;
import backend.ProcessOodtWrapper;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.WebPage;

import java.io.File;
import java.io.IOException;

import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;
import org.apache.wicket.markup.html.panel.FeedbackPanel;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;

	private FileUploadField fileUpload;
	private String UPLOAD_FOLDER = "C:\\";

	public HomePage() {
		super();

		add(new FeedbackPanel("feedback"));

		Form<?> form = new Form<Void>("form") {
			@Override
			protected void onSubmit() {

				final FileUpload uploadedFile = fileUpload.getFileUpload();
				if (uploadedFile != null) {
					// write to a new file
					File newFile = new File(UPLOAD_FOLDER
							+ uploadedFile.getClientFileName());

					String path = newFile.getAbsolutePath();

					if (newFile.exists()) {
						newFile.delete();
					}

					try {
						newFile.createNewFile();
						uploadedFile.writeTo(newFile);

						info("saved file: " + uploadedFile.getClientFileName());
					} catch (Exception e) {
						throw new IllegalStateException("Error");
					}
				}

			}

		};

		// Enable multipart mode (need for uploads file)
		form.setMultiPart(true);

		form.add(fileUpload = new FileUploadField("fileUpload"));

		add(form);

		add(new Label("version", getApplication().getFrameworkSettings().getVersion()));
    }
}
