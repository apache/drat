package backend;

import org.apache.oodt.cas.metadata.util.PathUtils;

import java.io.File;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class FileConstants {
    private static final String DRAT = "drat";
    public static final String DRAT_SUPER_DIR = getDratDirectory();
    public static final String OODT_PATH = buildDratSubdirectoryPath("/deploy/bin/oodt");
    public static final String DRAT_PATH = buildDratSubdirectoryPath("/deploy/bin/drat");
    public static final String DRAT_TEMP_UNZIPPED_PATH = buildDratSubdirectoryPath("/deploy/data/staging/uploaded_repo");
    public static final String DRAT_TEMP_LOG_OUTPUT = buildDratSubdirectoryPath("/deploy/data/drat_output.log");

    private static String getDratDirectory() {
        final String DRAT_HOME = PathUtils.replaceEnvVariables("[DRAT_HOME]");
        return DRAT_HOME.substring(0, DRAT_HOME.lastIndexOf(DRAT)+DRAT.length());
    }

    public static String buildDratSubdirectoryPath(String additionalPath) {
        return DRAT_SUPER_DIR + additionalPath;
    }
}
