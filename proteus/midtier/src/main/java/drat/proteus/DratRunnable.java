package drat.proteus;

import backend.DratWrapperException;
import backend.ProcessDratWrapper;

import java.io.File;

class DratRunnable implements Runnable {
    private final String filePath;
    private final String command;
    public DratRunnable(String filePath, String cmd) {
        this.filePath = filePath;
        this.command = cmd;
    }

    @Override
    public void run() {
        String cmdToUpper = command.toUpperCase();
        ProcessDratWrapper dratWrapper = ProcessDratWrapper.getInstance();
        dratWrapper.setIndexablePath(this.filePath);
        try {
            switch (cmdToUpper) {
                case "GO": {
                    dratWrapper.go();
                    break;
                }
                case "CRAWL": {
                    dratWrapper.crawl();
                    break;
                }
                case "REDUCE": {
                    dratWrapper.reduce();
                    break;
                }
                case "MAP": {
                    dratWrapper.map();
                    break;
                }
                case "INDEX": {
                    dratWrapper.index();
                    break;
                }
                default: {
                    throw new DratWrapperException("No matching step found for selection: " + command);
                }
            }
            deleteTempDratDirectory(filePath);
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }

    public void deleteTempDratDirectory(String filePath) {
        new File(filePath).delete();
    }
}