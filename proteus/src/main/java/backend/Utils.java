package backend;

import org.apache.oodt.cas.metadata.util.PathUtils;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utils {
    private static Map<String, String> environment = new HashMap<String, String>();
    private static List<String> resetDratConstants = new ArrayList<String>();
    static {
        environment.put("JAVA_HOME", PathUtils.replaceEnvVariables("[JAVA_HOME]"));
        environment.put("DRAT_HOME", PathUtils.replaceEnvVariables("[DRAT_HOME]"));
        environment.put("GANGLIA_URL", PathUtils.replaceEnvVariables("[GANGLIA_URL]"));

        buildEnvironmentVariables();

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

    public static void buildEnvironmentVariables() {
        if(environment.get("JAVA_HOME") ==null || environment.get("DRAT_HOME") == null
                || environment.get("GANGLIA_URL") == null) {
            throw new RuntimeException("Environment variables not set properly!");
        }
    }
}
