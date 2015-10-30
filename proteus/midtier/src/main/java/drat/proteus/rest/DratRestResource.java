package drat.proteus.rest;


import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import backend.ProcessOodtWrapper;
import drat.proteus.services.product.ProductItem;
import drat.proteus.services.product.ProductService;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestBody;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import java.io.IOException;
import java.util.List;

/**
 * Created by stevenfrancus on 10/20/15.
 */
public class DratRestResource extends GsonRestResource {
    public AbstractOodtWrapper oodtWrapper;
    public AbstractDratWrapper dratWrapper;
    public DratRestResource() {
        oodtWrapper = new ProcessOodtWrapper();
        dratWrapper = new ProcessDratWrapper();
    }

    @MethodMapping(value = "/drat", httpMethod = HttpMethod.GET)
    public List<ProductItem> getDratStatus() {
        ProductService productService = new ProductService();
        return productService.getAllRecentProducts();
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
