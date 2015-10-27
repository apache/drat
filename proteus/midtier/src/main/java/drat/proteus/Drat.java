package drat.proteus;

/**
 * Created by emily on 10/26/15.
 */
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
public class Drat extends WebPage {
    public Drat() {
        add(new Label("message", getPageParameters()));
    }
}