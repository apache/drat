package drat.proteus.services.general;

public class DratServiceStatus extends ServiceStatus {
    public enum State {
        INDEX, CRAWL, MAP, REDUCE, IDLE, INTERRUPTED
    }
    private State currentState;
    private int progress;

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

    public int getProgress() {
        return progress;
    }

    public void setProgress(int progress) {
        this.progress = progress;
    }

    @Override
    public boolean isRunning() {
        return super.isRunning();
    }
}
