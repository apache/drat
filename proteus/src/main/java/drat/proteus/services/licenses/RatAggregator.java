package drat.proteus.services.licenses;

import drat.proteus.services.general.Item;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

public class RatAggregator {
    private Map<String,Integer> licenses;
    private List<Item> ratUnapprovedLicenses;
    private int ratCount;
    public RatAggregator() {
        licenses = new HashMap<>();
        ratUnapprovedLicenses = new ArrayList<>();
        ratCount = 0;
    }

    public void clear() {
        licenses.clear();
        ratUnapprovedLicenses.clear();
        ratCount = 0;
    }

    public void add(RatLog log) {
        log.parse();
        ratCount++;
        addLogToRunningTotal(log);
        addUnapprovedLicenses(log);
    }

    public Map<String, Integer> getAggregatedLicenseTotal() {
        return this.licenses;
    }

    public List<Item> getRatUnapprovedLicenses() {
        return this.ratUnapprovedLicenses;
    }

    private void addUnapprovedLicenses(RatLog log) {
        List<String> unapproved = log.getUnapprovedLicenseFiles();
        this.ratUnapprovedLicenses.add(new UnapprovedLicensesItem(ratCount, unapproved));
    }

    private void addLogToRunningTotal(RatLog log) {
        Map<String,Integer> logLicenses = log.getLicenseHistogram();
        for(String key: logLicenses.keySet()) {
            Integer licenseAmountTotal = licenses.get(key);
            Integer licenseAmountLog = logLicenses.get(key);
            if(licenseAmountTotal != null) {
                licenseAmountLog += licenseAmountTotal;
            }
            licenses.put(key, licenseAmountLog);
        }
    }
}
