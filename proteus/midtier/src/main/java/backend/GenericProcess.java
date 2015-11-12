package backend;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStream;
import java.io.InputStreamReader;

/**
 * Created by stevenfrancus on 10/15/15.
 */
public class GenericProcess {
    private final String path;
    public GenericProcess(String path) {
        this.path = path;
    }
    public Process createProcess(String command) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(this.path, command);
        return spawnProcess(builder);
    }
    public Process createProcess(String command, String canonicalPath) throws IOException {
        ProcessBuilder builder = new ProcessBuilder(this.path, command, canonicalPath);
        return spawnProcess(builder);
    }
    private Process spawnProcess(ProcessBuilder builder) throws IOException {
        builder.environment().putAll(Utils.getEnvironment());
        Process process = builder.redirectErrorStream(true).start();
        InputStream is = process.getInputStream();
        BufferedReader reader = new BufferedReader(new InputStreamReader(is));
        String line = null;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
        }
        return process;
    }
}
