package backend;

import drat.proteus.services.general.DratServiceStatus;

/**
 * Created by stevenfrancus on 11/5/15.
 */
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
            if(this.proc.exitValue() == 0) {
                status.setCurrentState(DratServiceStatus.State.IDLE);
            } else {
                status.setCurrentState(DratServiceStatus.State.INTERRUPTED);
            }
        } catch (InterruptedException ie) {
            ie.printStackTrace();
            status.setCurrentState(DratServiceStatus.State.INTERRUPTED);
        }
    }
}