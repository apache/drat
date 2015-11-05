package backend;

import drat.proteus.services.general.DratServiceStatus;

import java.io.IOException;

class DratProcessMonitor implements Runnable {
    private DratServiceStatus status;
    private Process proc;

    public DratProcessMonitor(DratServiceStatus status, Process dratRunningProcess) {
        this.status = status;
        this.proc = dratRunningProcess;
    }

    @Override
    public void run() {
        try {
            this.proc.waitFor();
            status.setCurrentState(DratServiceStatus.State.IDLE);
        } catch (InterruptedException ie) {
            ie.printStackTrace();
            status.setCurrentState(DratServiceStatus.State.INTERRUPTED);
        }
    }
}

public class ProcessDratWrapper extends GenericProcess implements AbstractDratWrapper {
    private static final String DRAT = FileConstants.DRAT_PATH;
    private static final long DRAT_PROCESS_WAIT_DURATION = 3000;
    private String path;
    private DratServiceStatus status = new DratServiceStatus();
    private static ProcessDratWrapper singletonDratWrapper = new ProcessDratWrapper();
    public static ProcessDratWrapper getInstance() {
        return singletonDratWrapper;
    }

    private ProcessDratWrapper() {
        super(DRAT);
        this.path = "";
    }

    public void setIndexablePath(String canonicalPath) {
        this.path = canonicalPath;
    }

    public String getIndexablePath() {
        return this.path;
    }

    public void crawl() throws IOException, DratWrapperException {
        startAndMonitorDratProcess("crawl");
    }

    public void index() throws IOException, DratWrapperException {
        startAndMonitorDratProcess("index");
    }

    public void map() throws IOException, DratWrapperException {
        startAndMonitorDratProcess("map");
    }

    public void reduce() throws IOException, DratWrapperException {
        startAndMonitorDratProcess("reduce");
    }

    public void go() throws Exception {
        startAndMonitorDratProcess("crawl").waitFor();
        Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
        startAndMonitorDratProcess("index").waitFor();
        Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
        startAndMonitorDratProcess("map").waitFor();
        Thread.sleep(DRAT_PROCESS_WAIT_DURATION);
        startAndMonitorDratProcess("reduce").waitFor();
    }

    private Process startAndMonitorDratProcess(String dratCmd) throws IOException, DratWrapperException {
        DratServiceStatus.State dratState = DratServiceStatus.State.valueOf(dratCmd.toUpperCase());
        boolean needsPathParam = (dratState == DratServiceStatus.State.CRAWL) || (dratState == DratServiceStatus.State.INDEX);
        if (status.isRunning()) {
            throw new DratWrapperException("Drat is currently running with status: " + status.getCurrentState());
        }
        status.setCurrentState(dratState);
        Process process = (needsPathParam) ? super.createProcess(dratCmd, this.path) : super.createProcess(dratCmd);
        DratProcessMonitor monitor = new DratProcessMonitor(status, process);
        new Thread(monitor).start();
        return process;
    }

    public boolean isRunning() throws Exception {
        return status.isRunning();
    }

    public DratServiceStatus getDratStatus() {
        return status;
    }
}
