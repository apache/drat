package backend;

import java.io.File;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class FileConstants {
    private static final String DRAT = "drat";
    public static final String DRAT_SUPER_DIR = getDratDirectory();
    public static final String OODT_PATH = buildDratSubdirectoryPath("/deploy/bin/oodt");
    public static final String DRAT_PATH = buildDratSubdirectoryPath("/deploy/bin/drat");
    public static final String DRAT_TEMP_UNZIPPED_PATH = buildDratSubdirectoryPath("/data/staging/uploaded_repo");

    private static String getDratDirectory() {
        final File CURRENT_CLASS = new File(FileConstants.class.getProtectionDomain().getCodeSource().getLocation().getPath());
        String classPath = CURRENT_CLASS.getAbsolutePath();
        return classPath.substring(0, classPath.lastIndexOf(DRAT)+DRAT.length());
    }

    public static String buildDratSubdirectoryPath(String additionalPath) {
        return DRAT_SUPER_DIR + additionalPath;
    }
}
