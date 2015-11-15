package drat.proteus.services.general;

public class ServiceStatus {
    private boolean isRunning;
    public ServiceStatus(boolean isRunning) {
        this.isRunning = isRunning;
    }
    public boolean isRunning() {
        return isRunning;
    }
    public void isRunning(boolean isRunning) {
        this.isRunning = isRunning;
    }

}
