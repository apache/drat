package drat.proteus.services.constants;

public class ProteusEndpointConstants {
    public static final String BASE_URL = "http://localhost:8080";
    public static final String FILE_MANAGER_PRODUCTS = "viewRecent";
    public static final String HEALTH_STATUS_REPORT = "report";
    public static final String MIME_TYPE_SELECT = "select";

    public static class Services {
        public static final String MIME_TYPE_BREAKDOWN = "/solr/drat";
        public static final String FILE_MANAGER_PRODUCT = "/fmprod";
        public static final String HEALTH_MONITOR = "/pcs/services/health";
        public static final String RAT_INSTANCES_MONITOR = "/opsui/instances";
    }
}
