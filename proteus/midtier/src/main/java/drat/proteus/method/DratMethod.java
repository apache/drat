package drat.proteus.method;


import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;
import org.apache.wicket.markup.html.WebPage;
/**
 * Created by stevenfrancus on 10/20/15.
 */
enum DratMethodType {
    GO, INDEX, CRAWL, MAP, REDUCE
}
public class DratMethod extends WebPage {
    public AbstractOodtWrapper oodtWrapper;
    public AbstractDratWrapper dratWrapper;
    private static final String Q_PARAMS = "q";
    private static final String DIR_PARAMS = "dir";
    private String query;
    private String dratDirectoryPath;
    public DratMethod() throws Exception {
        //this.query = parameters.get(Q_PARAMS).toString();
       // this.dratDirectoryPath = parameters.get(DIR_PARAMS).toString();
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
