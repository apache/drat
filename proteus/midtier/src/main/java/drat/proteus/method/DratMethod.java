package drat.proteus.method;


import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;
import drat.proteus.status.DratStatus;
import org.apache.wicket.markup.html.WebPage;
import org.apache.wicket.markup.html.basic.Label;
import org.apache.wicket.request.mapper.parameter.PageParameters;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestBody;
import org.wicketstuff.rest.resource.AbstractRestResource;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/20/15.
 */
enum DratMethodType {
    GO, INDEX, CRAWL, MAP, REDUCE
}
class DratRequestWrapper {
    //needed for JSON Requests
    public String dirPath;
}
public class DratMethod extends GsonRestResource {
    public AbstractOodtWrapper oodtWrapper;
    public AbstractDratWrapper dratWrapper;
    private static final String Q_PARAMS = "query";
    private static final String DIR_PARAMS = "path";
    private String dratDirectoryPath;
    public DratMethod() {
        oodtWrapper = ProcessOodtWrapper.getInstance();
        dratWrapper = ProcessDratWrapper.getInstance();
    }

    @MethodMapping(value = "/drat", httpMethod = HttpMethod.GET)
    public DratStatus getDratStatus() {
        return null;
    }

    @MethodMapping(value = "/drat/go", httpMethod = HttpMethod.POST)
    public void go(@RequestBody DratRequestWrapper body) throws Exception {
        dratStartHelper(body.dirPath);
        dratWrapper.go();
    }

    @MethodMapping(value = "/drat/index", httpMethod = HttpMethod.POST)
    public void index(@RequestBody DratRequestWrapper body) throws Exception {
        dratStartHelper(body.dirPath);
        dratWrapper.index();
    }

    @MethodMapping(value = "/drat/crawl", httpMethod = HttpMethod.POST)
    public void crawl(@RequestBody DratRequestWrapper body) throws Exception {
        dratStartHelper(body.dirPath);
        dratWrapper.crawl();
    }

    @MethodMapping(value = "/drat/map", httpMethod = HttpMethod.POST)
    public void map() throws Exception {
        startOodtIfNotRunning();
        dratWrapper.map();
    }

    @MethodMapping(value = "/drat/reduce", httpMethod = HttpMethod.POST)
    public void reduce() throws Exception {
        startOodtIfNotRunning();
        dratWrapper.reduce();
    }


    private void startOodtIfNotRunning() throws IOException {
        if(!oodtWrapper.isRunning()) {
            oodtWrapper.reset();
            oodtWrapper.run();
        }
    }
    private void dratStartHelper(String dirPath) throws IOException {
        dratWrapper.setIndexablePath(dirPath);
        startOodtIfNotRunning();
    }

}
