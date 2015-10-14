package com.company;

import java.io.BufferedReader;
import java.io.IOException;
import java.io.InputStreamReader;
import java.util.HashMap;
import java.util.Map;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class OodtWrapper implements AbstractOodtWrapper {

    public void run() throws IOException {
        oodtGenericProcess("start");
    }

    public void reset() throws IOException {
        final String RM = "rm",
                    RF_OPTIONAL_PARAMS = "-rf";
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/data/workflow"), RF_OPTIONAL_PARAMS);
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/filemgr/catalog"), RF_OPTIONAL_PARAMS);
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/solr/drat/data"), RF_OPTIONAL_PARAMS);
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/data/archive/*"), RF_OPTIONAL_PARAMS);
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/workflow/run/cas.workflow.pid"), null);
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/filemgr/run/cas.filemgr.pid"), null);
        initResetProcess(RM, FileConstants.buildDratSubdirectoryPath("/deploy/resmgr/run/cas.resmgr.pid"), null);
    }

    public void stop() throws IOException {
        oodtGenericProcess("stop");
    }

    private void oodtGenericProcess(String command) throws IOException {
        String line;
        ProcessBuilder oodtProcessBuilder = new ProcessBuilder(FileConstants.OODT_PATH, command);
        oodtProcessBuilder.environment().putAll(Utils.getEnvironment());
        oodtProcessBuilder.redirectErrorStream(true);
        Process oodtProcess = oodtProcessBuilder.start();
        BufferedReader oodtProcessReader = new BufferedReader(new InputStreamReader(oodtProcess.getInputStream()));
        while (true) {
            line = oodtProcessReader.readLine();
            if (line == null) {
                break;
            }
            System.out.println(line);
        }
    }

    private void initResetProcess(String command, String path, String optionalParams) throws IOException {
        boolean hasOptionalParams = optionalParams != null;
        ProcessBuilder process = (hasOptionalParams) ? new ProcessBuilder(command, optionalParams, path) :
                new ProcessBuilder(command, path);
        process.environment().putAll(Utils.getEnvironment());
        process.redirectErrorStream(true);
        process.start();
    }
}
