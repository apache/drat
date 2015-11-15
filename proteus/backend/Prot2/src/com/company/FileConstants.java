package com.company;

import java.io.File;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class FileConstants {
    private static final String DRAT = "drat";
    public static final String DRAT_SUPER_DIR = getDratDirectory();
    public static final String DRAT_DEPLOY_DIR = buildDratSubdirectoryPath("/deploy");
    public static final String OODT_PATH = buildDratSubdirectoryPath("/deploy/bin/oodt");
    public static final String DRAT_PATH = buildDratSubdirectoryPath("/deploy/bin/drat");
    public static final String DRAT_SRC = buildDratSubdirectoryPath("/src");

    private static String getDratDirectory() {
        final File CURRENT_CLASS = new File(DratWrapper.class.getProtectionDomain().getCodeSource().getLocation().getPath());
        String classPath = CURRENT_CLASS.getAbsolutePath();
        return classPath.substring(0, classPath.lastIndexOf(DRAT)+1);
    }

    public static String buildDratSubdirectoryPath(String additionalPath) {
        return DRAT_SUPER_DIR + additionalPath;
    }
}
