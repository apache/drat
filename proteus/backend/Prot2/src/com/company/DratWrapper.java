package com.company;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class DratWrapper implements AbstractDratWrapper {
    private static final String DRAT = FileConstants.DRAT_PATH;
    private String path;
    private boolean isIndexedFlag = false;
    public DratWrapper(String canonicalPath) {
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
        genericDratProcess("crawl", this.path);
    }

    public void index() throws IOException {
        genericDratProcess("index", this.path);
        isIndexedFlag = true;
    }

    public void map() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        genericDratProcess("map", null);
    }

    public void reduce() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        genericDratProcess("reduce", null);
    }

    private void genericDratProcess(String command, String path) throws IOException {
        String line;
        ProcessBuilder builder = (path != null) ?
                new ProcessBuilder(FileConstants.DRAT_PATH, command, path)
                : new ProcessBuilder(FileConstants.DRAT_PATH, command);
        builder.environment().putAll(Utils.getEnvironment());
        builder.redirectErrorStream(true);
        Process p = builder.start();
        BufferedReader r = new BufferedReader(new InputStreamReader(p.getInputStream()));
        while (true) {
            line = r.readLine();
            if (line == null) {
                break;
            }
            System.out.println(line);
        }
    }
}
