package com.company;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class ProcessDratWrapper extends GenericProcess implements AbstractDratWrapper {
    private static final String DRAT = FileConstants.DRAT_PATH;
    private String path;
    private boolean isIndexedFlag = false;
    public ProcessDratWrapper() {
        super(DRAT);
    }
    public ProcessDratWrapper(String canonicalPath) {
        this();
        this.path = canonicalPath;
    }
    public void setIndexablePath(String canonicalPath) {
        isIndexedFlag = !this.path.equals(canonicalPath);
        this.path = canonicalPath;
    }
    public String getIndexablePath() {
        return this.path;
    }
    public void crawl() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        super.createProcess("crawl", this.path);
    }

    public void index() throws IOException {
        super.createProcess("index", this.path);
        isIndexedFlag = true;
    }

    public void map() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        super.createProcess("map");
    }

    public void reduce() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        super.createProcess("reduce");
    }
}
