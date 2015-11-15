package drat.proteus.rest;

import com.google.gson.Gson;
import drat.proteus.services.general.Item;
import drat.proteus.services.general.ServiceStatus;
import drat.proteus.services.health.HealthMonitorService;
import drat.proteus.services.licenses.RatInstanceService;
import drat.proteus.services.mimetype.MimeTypeBreakdownService;
import drat.proteus.services.product.RecentProductService;
import drat.proteus.services.repo.Repository;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestParam;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;
import java.util.List;
import java.util.Map;

public class ServicesRestResource extends GsonRestResource {
    private RecentProductService productService;
    private HealthMonitorService healthMonitorService;
    private MimeTypeBreakdownService mimeTypeBreakdownService;
    private RatInstanceService ratInstanceService;
    public ServicesRestResource() {
        productService = new RecentProductService();
        healthMonitorService = new HealthMonitorService();
        mimeTypeBreakdownService = new MimeTypeBreakdownService();
        ratInstanceService = new RatInstanceService();
    }

    @MethodMapping(value = "/repo/licenses/unapproved", httpMethod = HttpMethod.GET)
    public List<Item> getUnapprovedLicensesFromRatInstances() {
        ratInstanceService.getRatLogs();
        return ratInstanceService.getUnapprovedLicenses();
    }

    @MethodMapping(value = "/products", httpMethod = HttpMethod.GET)
    public List<Item> getRecentProducts() {
        return productService.getAllRecentProducts();
    }

    @MethodMapping(value = "/repo/breakdown/mime", httpMethod = HttpMethod.GET)
    public List<Item> getRepoMimeTypeBreakdown(@RequestParam(value = "limit", required = false) Integer limit) {
        if(limit == null) {
            limit = 0;
        }
        return mimeTypeBreakdownService.getMimeTypes(limit);
    }

    @MethodMapping(value = "/repo/breakdown/license", httpMethod = HttpMethod.GET)
    public List<Item> getRepoLicenseTypeBreakdown() {
        ratInstanceService.getRatLogs();
        return ratInstanceService.getUnapprovedLicenses();
    }

    @MethodMapping(value = "/repo/size", httpMethod = HttpMethod.GET)
    public Repository.Size getRepositorySize(@RequestParam("dir") String dirPath) {
        return new Repository(dirPath).getSize();
    }

    @MethodMapping(value = "/status/drat", httpMethod = HttpMethod.GET)
    public ServiceStatus getDratRunningStatus() {
        return healthMonitorService.getDratStatus();
    }

    @MethodMapping(value = "/status/oodt", httpMethod = HttpMethod.GET)
    public ServiceStatus getOodtRunningStatus() {
        return healthMonitorService.getOodtStatus();
    }

    @MethodMapping(value = "/status/oodt/raw", httpMethod = HttpMethod.GET)
    public Object getOodtRawHealthStatus() {
        String jsonBody = healthMonitorService.rerouteHealthMonitorData().readEntity(String.class);
        return (Map<String,Object>)new Gson().fromJson(jsonBody, Map.class);
    }
}
