package drat.proteus.method;


import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.request.mapper.parameter.PageParameters;

/**
 * Created by stevenfrancus on 10/20/15.
 */
enum DratMethodType {
    GO, INDEX, CRAWL, MAP, REDUCE
}
public class DratMethod extends WebPage {
    public AbstractOodtWrapper oodtWrapper;
    public AbstractDratWrapper dratWrapper;
    private static final String Q_PARAMS = "query";
    private static final String DIR_PARAMS = "path";
    private String query;
    private String dratDirectoryPath;
    public DratMethod(final PageParameters params) throws Exception {
        this.query = params.get(Q_PARAMS).toString();
        this.dratDirectoryPath = params.get(DIR_PARAMS).toString();
        add(new Label("message", params));
        oodtWrapper = new ProcessOodtWrapper();
        dratWrapper = new ProcessDratWrapper(this.dratDirectoryPath);
        execute();

    }
    public void execute() throws Exception {
        DratMethodType type = DratMethodType.valueOf(this.query);
        if(!oodtWrapper.isRunning()) {
            oodtWrapper.reset();
            oodtWrapper.run();
        }
        switch(type) {
            case GO: {
                dratWrapper.go();
            }
            case INDEX: {
                dratWrapper.index();
            }
            case CRAWL: {
                dratWrapper.crawl();
            }
            case MAP: {
                dratWrapper.map();
            }
            case REDUCE: {
                dratWrapper.reduce();
            }
            default: {
                throw new IllegalStateException();
            }
        }
    }
}
