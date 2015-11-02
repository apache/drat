package drat.proteus.services.general;

import drat.proteus.rest.DratMethodType;

/**
 * Created by stevenfrancus on 11/1/15.
 */
public class DratServiceStatus extends ServiceStatus {
    private double currentProgress;
    private DratMethodType step;

    private DratServiceStatus() {

    }

    public DratServiceStatus getCurrentStatus() {
        return new DratServiceStatus();
    }

    public double getCurrentProgress() {
        return currentProgress;
    }

    public void setCurrentProgress(double currentProgress) {
        this.currentProgress = currentProgress;
    }

    public DratMethodType getStep() {
        return step;
    }

    public void setStep(DratMethodType step) {
        this.step = step;
    }
}
