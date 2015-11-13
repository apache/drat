package drat.proteus.services.rat;

import drat.proteus.services.general.Item;

/**
 * Created by stevenfrancus on 11/12/15.
 */

public class RatAggregateJobCountItem extends Item {
    private final int numberOfJobs;
    private static final String PGE_EXEC_STRING_TO_ENUM = "PGE EXEC";
    enum RatJobState {
        PGE_EXEC, QUEUED, RSUBMIT, FINISHED, STARTED, PAUSED
    }
    private final RatJobState state;

    public RatAggregateJobCountItem(String stateStr, int numberOfJobs) {
        if(stateStr.equals(PGE_EXEC_STRING_TO_ENUM)) {
            state = RatJobState.PGE_EXEC;
        }
        else {
            state = RatJobState.valueOf(stateStr);
        }
        this.numberOfJobs = numberOfJobs;
    }

    public int getNumberOfJobs() {
        return numberOfJobs;
    }

    public RatJobState getState() {
        return state;
    }
}
