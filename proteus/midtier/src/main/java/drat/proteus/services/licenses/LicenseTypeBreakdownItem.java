package drat.proteus.services.licenses;

import drat.proteus.services.breakdown.BreakdownItem;

public class LicenseTypeBreakdownItem extends BreakdownItem {
    public LicenseTypeBreakdownItem(String type, int numberOfFiles) {
        super(type, numberOfFiles);
    }

    public LicenseTypeBreakdownItem(String type, int numberOfFiles, int repoSize) {
        super(type, numberOfFiles, repoSize);
    }
}
