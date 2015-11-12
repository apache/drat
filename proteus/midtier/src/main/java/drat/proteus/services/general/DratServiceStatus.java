package drat.proteus.services.general;

import drat.proteus.rest.DratMethodType;

/**
 * Created by stevenfrancus on 11/1/15.
 */
public class DratServiceStatus extends ServiceStatus {
    public enum State {
        INDEX, CRAWL, MAP, REDUCE, IDLE, INTERRUPTED
    }
    private State currentState;

    public DratServiceStatus() {
        super(false); //since the status is a static variable, DRAT hasn't started yet
        this.currentState = State.IDLE;
    }

    public State getCurrentState() {
        return currentState;
    }
    public void setCurrentState(State status) {
        this.currentState = status;
        super.isRunning(currentState != State.IDLE && currentState != State.INTERRUPTED);
    }

    @Override
    public boolean isRunning() {
        return super.isRunning();
    }
}
