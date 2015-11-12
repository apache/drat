package drat.proteus.services.rat;

import drat.proteus.services.constants.ProteusEndpointConstants;
import drat.proteus.services.general.AbstractRestService;

/**
 * Created by stevenfrancus on 11/11/15.
 */
public class RatInstanceService extends AbstractRestService {
    public RatInstanceService() {
        super(ProteusEndpointConstants.Services.RAT_INSTANCES_MONITOR);
    }
}
