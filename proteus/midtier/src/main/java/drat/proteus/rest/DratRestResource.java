package drat.proteus.rest;


import backend.*;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestBody;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import java.io.File;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Paths;

public class DratRestResource extends GsonRestResource {
    public AbstractOodtWrapper oodtWrapper;
    public AbstractDratWrapper dratWrapper;
    public DratRestResource() {
        oodtWrapper = ProcessOodtWrapper.getInstance();
        dratWrapper = ProcessDratWrapper.getInstance();
    }

    @MethodMapping(value = "/go", httpMethod = HttpMethod.POST)
    public void go(@RequestBody DratRequestWrapper body) throws Exception {
        dratWrapper.setIndexablePath(body.dirPath);
        dratWrapper.go();
    }

    @MethodMapping(value = "/index", httpMethod = HttpMethod.POST)
    public void index(@RequestBody DratRequestWrapper body) throws Exception {
        dratWrapper.setIndexablePath(body.dirPath);
        dratWrapper.index();
    }

    @MethodMapping(value = "/crawl", httpMethod = HttpMethod.POST)
    public void crawl(@RequestBody DratRequestWrapper body) throws Exception {
        dratWrapper.setIndexablePath(body.dirPath);
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
        File log = new File(FileConstants.DRAT_TEMP_LOG_OUTPUT);
        if (log.exists())
        {
            try {
                byte[] encoded = Files.readAllBytes(Paths.get(log.getAbsolutePath()));
                return new String(encoded);
            }
            catch (IOException ioe)
            {
                return ioe.getMessage();
            }
        }
        else
        {
            return "Log is empty!";
        }
    }
}
