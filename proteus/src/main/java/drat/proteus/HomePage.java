package drat.proteus;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.form.Form;
import org.apache.wicket.markup.html.form.upload.FileUploadField;

public class HomePage extends WebPage {
	private static final long serialVersionUID = 1L;
    private FileUploadField fileUploadField;
	public HomePage() {
	    fileUploadField = new FileUploadField("fileUploader");
        Form form = new DratStartForm("form", fileUploadField);
        add(form);
    }
}
