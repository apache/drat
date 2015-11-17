package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utils {
    private static Map<String, String> environment = new HashMap<String, String>();
    private static List<String> resetDratConstants = new ArrayList<String>();
    static {
        environment.put("JAVA_HOME", System.getenv("JAVA_HOME"));
        environment.put("DRAT_HOME", System.getenv("DRAT_HOME"));
        environment.put("GANGLIA_URL", System.getenv("GANGLIA_URL"));

        String DRAT_HOME = environment.get("DRAT_HOME");
        resetDratConstants.add(DRAT_HOME + "/data/workflow");
        resetDratConstants.add(DRAT_HOME + "/filemgr/catalog");
        resetDratConstants.add(DRAT_HOME + "/solr/drat/data");
        resetDratConstants.add(DRAT_HOME + "/data/archive/*");
        resetDratConstants.add(DRAT_HOME + "/data/jobs/*");
    }
    public static Map<String, String> getEnvironment() {
        return environment;
    }
    public static List<String> getResetDirectories() { return resetDratConstants; }
}
