package drat.proteus;

import org.apache.wicket.RestartResponseException;
import org.apache.wicket.protocol.http.servlet.ServletWebRequest;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.WebPage;

import java.io.File;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.upload.FileUpload;
import org.apache.wicket.markup.html.form.upload.FileUploadField;
import org.apache.wicket.markup.html.panel.FeedbackPanel;
import org.apache.wicket.request.IRequestHandler;
import org.apache.wicket.request.IRequestMapper;
import org.apache.wicket.request.Request;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;

	private FileUploadField fileUpload;
	private String UPLOAD_FOLDER = "C:\\";

	public HomePage(final PageParameters parameters) {
		super(parameters);

		add(new FeedbackPanel("feedback"));

		Form<?> form = new Form<Void>("form") {
			@Override
			protected void onSubmit() {

				String path = "";

				final FileUpload uploadedFile = fileUpload.getFileUpload();
				if (uploadedFile != null) {
					// write to a new file
					File newFile = new File(UPLOAD_FOLDER
							+ uploadedFile.getClientFileName());

					path = newFile.getAbsolutePath();

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

				PageParameters pageParameters = new PageParameters();
				pageParameters.add(path, path);
				setResponsePage(Drat.class, pageParameters);

				//throw new RestartResponseException(Drat.class);

				/*

				IRequestMapper mapper = getApplication().getRootRequestMapper();
				Request request =

				IRequestHandler handler = mapper.mapRequest(request);

				if (handler != null)
				{
					getRequestCycle().scheduleRequestHandlerAfterCurrent(handler);
				}

				getRequestCycle().setResponsePage(new Drat());

				*/
			}

		};

		// Enable multipart mode (need for uploads file)
		form.setMultiPart(true);

		form.add(fileUpload = new FileUploadField("fileUpload"));



		add(form);

		add(new Label("version", getApplication().getFrameworkSettings().getVersion()));



    }
}
