package drat.proteus.services.general;

import backend.AbstractDratWrapper;
import backend.AbstractOodtWrapper;
import backend.ProcessDratWrapper;

/**
 * Created by stevenfrancus on 11/1/15.
 */
public class ServiceStatus {
    private boolean isRunning;
    public static OodtServiceStatus getOodtStatus() {
        return null;
    }
    public static DratServiceStatus getDratStatus() {
        return null;
    }
    public boolean isRunning() {
        return isRunning;
    }
    public void isRunning(boolean isRunning) {
        this.isRunning = isRunning;
    }

}
