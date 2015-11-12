package drat.proteus.services.rat;

import drat.proteus.services.general.Item;

/**
 * Created by stevenfrancus on 11/11/15.
 */

public class RatInstanceItem extends Item {
    enum RatInstanceStatus {
        QUEUED, PGE_EXEC, FINISHED, ALL
    }
    private RatInstanceStatus status;
    public RatInstanceItem() {
        //
    }
}
