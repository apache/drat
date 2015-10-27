package drat.proteus;

import org.apache.wicket.RestartResponseException;
import org.apache.wicket.protocol.http.servlet.ServletWebRequest;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.WebPage;

import java.io.File;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.panel.FeedbackPanel;
import org.apache.wicket.model.Model;
import org.apache.wicket.request.IRequestHandler;
import org.apache.wicket.request.IRequestMapper;
import org.apache.wicket.request.Request;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;

	final TextField<String> path = new TextField<String>("path",
			Model.of("")
	);

	public HomePage(final PageParameters parameters) {
		super(parameters);

		add(new FeedbackPanel("feedback"));

		path.setRequired(true);


		Form<?> form = new Form<Void>("form") {
			@Override
			protected void onSubmit() {

				String pathStr = path.getModelObject();

				PageParameters pageParameters = new PageParameters();
				pageParameters.add("path", pathStr);
				setResponsePage(Drat.class, pageParameters);
			}
		};

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
			//}

		// Enable multipart mode (need for uploads file)
		form.setMultiPart(true);

		form.add(path);

		add(form);

		add(new Label("version", getApplication().getFrameworkSettings().getVersion()));



    }
}
