package backend;

import java.util.HashMap;
import java.util.Map;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class Utils {
    private static Map<String, String> environment = new HashMap<String, String>();
    static {
        environment.put("JAVA_HOME", "/Library/Java/JavaVirtualMachines/jdk1.8.0_65.jdk/Contents/Home");
        environment.put("DRAT_HOME", FileConstants.buildDratSubdirectoryPath("/deploy"));
        environment.put("GANGLIA_URL", "http://zipper.jpl.nasa.gov/ganglia/");
    }
    public static Map<String, String> getEnvironment() {
        return environment;
    }
}
