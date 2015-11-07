package drat.proteus;

/**
 * Created by emily on 10/26/15.
 */
import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.request.mapper.parameter.PageParameters;

public class Drat extends WebPage {
    AbstractOodtWrapper oodtWrapper = ProcessOodtWrapper.getInstance();
    AbstractDratWrapper dratWrapper = ProcessDratWrapper.getInstance();;
    public Drat(final PageParameters params) {
        dratWrapper.setIndexablePath(params.get("path").toString());
        try {
            oodtWrapper.stop();
            oodtWrapper.reset();
            oodtWrapper.run();
            dratWrapper.go();
        }
        catch(Exception e) {
            e.printStackTrace();
        }
        add(new Label("message", params));
    }
}