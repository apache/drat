package drat.proteus.services.health;

import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.HttpMethodEnum;
import drat.proteus.services.general.RequestEmitter;

import javax.ws.rs.core.Response;
import java.util.ArrayList;
import java.util.List;

/**
 * Created by stevenfrancus on 10/29/15.
 */
public class HealthMonitorService extends RequestEmitter {
    public HealthMonitorService() {
        super(ProteusEndpointConstants.Services.HEALTH_MONITOR);
    }
    public List<HealthMonitorItem> getHealthMonitor() {
        Response response = this.createRequest(ProteusEndpointConstants.HEALTH_STATUS_REPORT)
                .getResponse(HttpMethodEnum.GET);
        return new ArrayList<HealthMonitorItem>();
    }
}
