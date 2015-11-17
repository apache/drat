package drat.proteus;

import backend.DratWrapperException;
import backend.ProcessDratWrapper;

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
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }
}