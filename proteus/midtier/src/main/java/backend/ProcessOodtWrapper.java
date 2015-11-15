package backend;

import drat.proteus.services.health.HealthMonitorService;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class ProcessOodtWrapper extends GenericProcess implements AbstractOodtWrapper {
    private static final String OODT = FileConstants.OODT_PATH;
    private HealthMonitorService healthMonitorService;
    private static ProcessOodtWrapper singletonOodtWrapper = new ProcessOodtWrapper();

    public static ProcessOodtWrapper getInstance() {
        return singletonOodtWrapper;
    }
    private ProcessOodtWrapper() {
        super(OODT);
        healthMonitorService = new HealthMonitorService();
    }

    public void run() throws IOException {
        super.createProcess("start");
    }

    public void stop() throws IOException {
        super.createProcess("stop");
    }

    public boolean isRunning() {
        return healthMonitorService.getOodtStatus().isRunning();
    }
}
