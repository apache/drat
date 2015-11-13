package drat.proteus.services.mimetype;

import drat.proteus.services.general.Item;

/**
 * Created by stevenfrancus on 11/12/15.
 */
public class MimeTypeBreakdownItem extends Item {
    private String mimeType;
    private int numberOfFiles;
    private transient int repoSize;
    private double weight;

    public MimeTypeBreakdownItem(String mimeType, int numberOfFiles) {
        this.mimeType = mimeType;
        this.numberOfFiles = numberOfFiles;
    }

    public MimeTypeBreakdownItem(String mimeType, int numberOfFiles, int repoSize) {
        this(mimeType, numberOfFiles);
        this.repoSize = repoSize;
        setBreakdown();
    }

    public double getBreakdown() {
        return this.weight;
    }

    public void setRepoSize(int repoSize) {
        this.repoSize = repoSize;
        setBreakdown();
    }

    public int getNumberOfFiles() {
        return numberOfFiles;
    }

    public String getMimeType() {
        return mimeType;
    }

    private void setBreakdown() {
        this.weight = this.numberOfFiles*1.0/this.repoSize;
    }
}
