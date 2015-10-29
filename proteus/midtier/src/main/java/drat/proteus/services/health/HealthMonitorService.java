package drat.proteus.services.health;

import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.RequestEmitter;

/**
 * Created by stevenfrancus on 10/29/15.
 */
public class HealthMonitorService extends RequestEmitter {
    public HealthMonitorService() {
        super(ProteusEndpointConstants.HEALTH_STATUS_SERVICE);
    }
}
