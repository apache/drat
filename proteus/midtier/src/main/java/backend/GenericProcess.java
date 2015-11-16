package backend;

import java.io.*;

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
        pipeOutputToLogFile(process.getInputStream());
        return process;
    }

    private void pipeOutputToLogFile(InputStream processInput) throws IOException {
        BufferedReader reader = new BufferedReader(new InputStreamReader(processInput));
        final File dratLog = new File(FileConstants.DRAT_TEMP_LOG_OUTPUT);
        if(!dratLog.exists()) {
            dratLog.createNewFile();
        }

        FileWriter fw = new FileWriter(dratLog.getAbsoluteFile());
        BufferedWriter bw = new BufferedWriter(fw);
        String line = null;
        while ((line = reader.readLine()) != null) {
            System.out.println(line);
            bw.write(line);
        }
        bw.close();
        fw.close();
        reader.close();
    }
}
