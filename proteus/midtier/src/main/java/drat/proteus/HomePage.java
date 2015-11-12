package drat.proteus;

import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.markup.html.WebPage;


import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.panel.FeedbackPanel;
import org.apache.wicket.model.Model;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;

	final TextField<String> path = new TextField<String>("path",
			Model.of("")
	);
    final TextField<String> query = new TextField<String>("query",
            Model.of("")
    );

	public HomePage() {
		super();

    }
}
