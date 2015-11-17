package drat.proteus.services.breakdown;

import drat.proteus.services.general.Item;

public class BreakdownItem extends Item {
    private String type;
    private int numberOfObjects;
    private transient int totalSize;
    private double weight;

    public BreakdownItem(String type, int numObjs) {
        this.type = type;
        this.numberOfObjects = numObjs;
    }

    public BreakdownItem(String type, int numObjs, int repoSize) {
        this(type, numObjs);
        this.totalSize = repoSize;
        setBreakdown();
    }

    public double getBreakdown() {
        return this.weight;
    }

    public void setRepoSize(int repoSize) {
        this.totalSize = repoSize;
        setBreakdown();
    }

    public int getNumberOfObjects() {
        return this.numberOfObjects;
    }

    public String getType() {
        return type;
    }

    private void setBreakdown() {
        this.weight = this.numberOfObjects*1.0/this.totalSize;
    }
}
