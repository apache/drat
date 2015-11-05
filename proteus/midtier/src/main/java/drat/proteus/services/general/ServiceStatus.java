package drat.proteus.services.general;

import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;
import drat.proteus.services.health.HealthMonitorService;

/**
 * Created by stevenfrancus on 11/1/15.
 */
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
