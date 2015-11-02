package drat.proteus.rest;

import drat.proteus.services.general.Item;
import drat.proteus.services.general.ServiceStatus;
import drat.proteus.services.product.ProductItem;
import drat.proteus.services.product.ProductService;
import drat.proteus.services.repo.Repository;
import org.wicketstuff.rest.annotations.MethodMapping;
import org.wicketstuff.rest.annotations.parameters.RequestParam;
import org.wicketstuff.rest.resource.gson.GsonRestResource;
import org.wicketstuff.rest.utils.http.HttpMethod;

import java.util.ArrayList;
import java.util.List;

/**
 * Created by stevenfrancus on 10/30/15.
 */
public class ServicesRestResource extends GsonRestResource {
    private ProductService productService;
    public ServicesRestResource() {
        productService = new ProductService();
    }
    @MethodMapping(value = "/products", httpMethod = HttpMethod.GET)
    public List<Item> getRecentProducts() {
        return productService.getAllRecentProducts();
    }

    @MethodMapping(value = "/repo/breakdown", httpMethod = HttpMethod.GET)
    public List<Item> getRepoTypeBreakdown(@RequestParam("type") String type) {
        switch(type.toUpperCase()) {
            case "LICENSE": {
                return this.getLicenseTypeBreakdown();
            }
            case "MIME": {
                return this.getMimeTypeBreakdown();
            }
            case "BOTH": {

            }
            default : {

            }
        }
        return null;
    }

    @MethodMapping(value = "/repo/size", httpMethod = HttpMethod.GET)
    public Repository.Size getRepositorySize(@RequestParam("dir") String dirPath) {
        return new Repository(dirPath).getSize();
    }

    private List<Item> getLicenseTypeBreakdown() {
        return new ArrayList<>();
    }
    private List<Item> getMimeTypeBreakdown() {
        return new ArrayList<>();
    }

    @MethodMapping(value = "/status", httpMethod = HttpMethod.GET)
    public ServiceStatus getRunningStatus(@RequestParam("type") String serviceType) {
        switch(serviceType.toUpperCase()) {
            case "DRAT": {
                return ServiceStatus.getDratStatus();
            }
            case "OODT": {
                return ServiceStatus.getOodtStatus();
            }
            default: {
                return null;
            }
        }
    }
}
