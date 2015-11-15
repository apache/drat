package drat.proteus.rest;


import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestBody;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import java.io.File;

public class DratRestResource extends GsonRestResource {
    public AbstractOodtWrapper oodtWrapper;
    public AbstractDratWrapper dratWrapper;
    public DratRestResource() {
        oodtWrapper = ProcessOodtWrapper.getInstance();
        dratWrapper = ProcessDratWrapper.getInstance();
    }

    @MethodMapping(value = "/go", httpMethod = HttpMethod.POST)
    public void go(@RequestBody DratRequestWrapper body) throws Exception {
        File tempDir = Unzipper.unzip(body.zipFile);
        dratWrapper.setIndexablePath(tempDir.getCanonicalPath());
        dratWrapper.go();
    }

    @MethodMapping(value = "/index", httpMethod = HttpMethod.POST)
    public void index(@RequestBody DratRequestWrapper body) throws Exception {
        File tempDir = Unzipper.unzip(body.zipFile);
        dratWrapper.setIndexablePath(tempDir.getCanonicalPath());
        dratWrapper.index();
    }

    @MethodMapping(value = "/crawl", httpMethod = HttpMethod.POST)
    public void crawl(@RequestBody DratRequestWrapper body) throws Exception {
        File tempDir = Unzipper.unzip(body.zipFile);
        dratWrapper.setIndexablePath(tempDir.getCanonicalPath());
        dratWrapper.crawl();
    }

    @MethodMapping(value = "/map", httpMethod = HttpMethod.POST)
    public void map() throws Exception {
        dratWrapper.map();
    }

    @MethodMapping(value = "/reduce", httpMethod = HttpMethod.POST)
    public void reduce() throws Exception {
        dratWrapper.reduce();
    }

    @MethodMapping(value = "/reset", httpMethod = HttpMethod.POST)
    public void reset() throws Exception {
        dratWrapper.reset();
    }

    @MethodMapping(value = "/log", httpMethod = HttpMethod.GET)
    public String getProcessLog() {
        return "";
    }
}
