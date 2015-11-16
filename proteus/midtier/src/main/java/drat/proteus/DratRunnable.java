package drat.proteus;

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
                }
                case "CRAWL": {
                    dratWrapper.crawl();
                }
                case "REDUCE": {
                    dratWrapper.reduce();
                }
                case "MAP": {
                    dratWrapper.map();
                }
                case "INDEX": {
                    dratWrapper.index();
                }
            }
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }
}