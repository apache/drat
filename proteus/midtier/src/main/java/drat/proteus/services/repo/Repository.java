package drat.proteus.services.repo;

import java.io.File;

/**
 * Created by stevenfrancus on 11/1/15.
 */
public class Repository {
    public class Size {
        public int numberOfFiles;
        public long memorySize;
        public Size(int fileSize, long memSize) {
            this.numberOfFiles = fileSize;
            this.memorySize = memSize;
        }
    }
    private static final int SIZE_UNKNOWN = -1; //sentinel value before repo size computation
    private String dir;
    private int numberOfFiles = SIZE_UNKNOWN;
    private long memorySize = SIZE_UNKNOWN;

    public Repository(String dirPath) {
        this.dir = dirPath;
    }

    public Size getSize() {
        if (numberOfFiles == SIZE_UNKNOWN) {
            getRepositoryFileInformation(this.dir);
        }
        return new Size(this.numberOfFiles, this.memorySize);
    }


    private void getRepositoryFileInformation(String dirPath) {
        File f = new File(dirPath);
        File[] files = f.listFiles();
        if (files != null)
            for (int i = 0; i < files.length; i++) {
                numberOfFiles++;
                memorySize += files[i].length();
                File file = files[i];

                if (file.isDirectory()) {
                    getRepositoryFileInformation(file.getAbsolutePath());
                }
            }
    }
}

