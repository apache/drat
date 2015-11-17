package drat.proteus.services.licenses;

import drat.proteus.services.general.Item;

import java.util.List;

public class UnapprovedLicensesItem extends Item {
    private final Integer ratId;
    private List<String> unapprovedFiles;
    public UnapprovedLicensesItem(Integer id, List<String> unapprovedFiles) {
        ratId = id;
        this.unapprovedFiles = unapprovedFiles;
    }

    public Integer getRatId() {
        return ratId;
    }

    public List<String> getUnapprovedFiles() {
        return unapprovedFiles;
    }
}
