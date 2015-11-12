package drat.proteus.services.constants;

/**
 * Created by stevenfrancus on 10/28/15.
 */
public class ProteusEndpointConstants {
    public static final String BASE_URL = "http://localhost:8080";
    public static final String FILE_MANAGER_PRODUCTS = "viewRecent";
    public static final String HEALTH_STATUS_REPORT = "report";

    public static class Services {
        public static final String FILE_MANAGER_PRODUCT = "/fmprod";
        public static final String HEALTH_MONITOR = "/pcs/services/health";
        public static final String RAT_INSTANCES_MONITOR = "/opsui/instances";
    }
}
