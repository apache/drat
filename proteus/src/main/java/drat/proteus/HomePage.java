package drat.proteus;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.TextField;
import org.apache.wicket.markup.html.form.upload.FileUploadField;
import org.apache.wicket.model.Model;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;
    private FileUploadField fileUploadField;
	public HomePage() {
        fileUploadField = new FileUploadField("fileUploader");
        final TextField<String> path = new TextField<String>("path",
                Model.of(""));
        Form form = new DratStartForm("form", fileUploadField, path);
        add(form);
    }
}
