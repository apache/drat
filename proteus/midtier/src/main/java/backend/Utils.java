package backend;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class Utils {
    private static Map<String, String> environment = new HashMap<String, String>();
    private static List<String> resetDratConstants = new ArrayList<String>();
    static {
        environment.put("JAVA_HOME", "/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home");
        environment.put("DRAT_HOME", FileConstants.buildDratSubdirectoryPath("/deploy"));
        environment.put("GANGLIA_URL", "http://zipper.jpl.nasa.gov/ganglia/");

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
