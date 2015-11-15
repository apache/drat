package com.company;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;

/**
 * Created by stevenfrancus on 10/15/15.
 */
public class GenericProcess {
    private final String path;
    public GenericProcess(String path) {
        this.path = path;
    }
    public void createProcess(String command) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(this.path, command);
        spawnProcess(builder);
    }
    public void createProcess(String command, String canonicalPath) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(this.path, command, canonicalPath);
        spawnProcess(builder);
    }
    private void spawnProcess(ProcessBuilder builder) throws IOException {
        String line;
        builder.environment().putAll(Utils.getEnvironment());
        builder.redirectErrorStream(true);
        Process process = builder.start();
        BufferedReader reader = new BufferedReader(new InputStreamReader(process.getInputStream()));
        while (true) {
            line = reader.readLine();
            if (line == null) {
                break;
            }
            System.out.println(line);
        }
    }
}
