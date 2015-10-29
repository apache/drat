package backend;

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
    public Process createProcess(String command, boolean doPrint) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(this.path, command);
        return spawnProcess(builder, doPrint);
    }
    public Process createProcess(String command, String canonicalPath, boolean doPrint) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(this.path, command, canonicalPath);
        return spawnProcess(builder, doPrint);
    }
    private Process spawnProcess(ProcessBuilder builder, boolean doPrint) throws IOException {
        builder.environment().putAll(Utils.getEnvironment());
        Process process = builder.redirectErrorStream(true)
                .start();
        if(doPrint) { printProcessOutput(process); }
        return process;
    }
    private void printProcessOutput(Process process) throws IOException {
        String line = "";
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
