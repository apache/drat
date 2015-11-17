package drat.proteus.services.mimetype;

import drat.proteus.services.breakdown.BreakdownItem;

public class MimeTypeBreakdownItem extends BreakdownItem {
    public MimeTypeBreakdownItem(String type, int numberOfFiles) {
        super(type, numberOfFiles);
    }

    public MimeTypeBreakdownItem(String type, int numberOfFiles, int repoSize) {
        super(type, numberOfFiles, repoSize);
    }
}
