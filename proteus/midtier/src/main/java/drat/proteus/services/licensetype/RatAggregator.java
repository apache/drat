package drat.proteus.services.licensetype;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;


public class RatAggregator {
    private Map<String,Integer> licenses;
    public RatAggregator() {
        licenses = new HashMap<String, Integer>();
    }

    public void add(RatLog log) {
        log.parse();
        addLogToRunningTotal(log);
    }

    public void remove(RatLog log) {
        log.parse();
        subtractLogFromRunningTotal(log);
    }

    public Map<String, Integer> getAggregatedLicenseTotal() {
        return this.licenses;
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

    private void subtractLogFromRunningTotal(RatLog log) {
        Map<String,Integer> logLicenses = log.getLicenseHistogram();
        for(String key: logLicenses.keySet()) {
            Integer licenseAmountTotal = licenses.get(key);
            Integer licenseAmountLog = logLicenses.get(key);
            licenseAmountTotal -= licenseAmountLog;
            licenses.put(key, licenseAmountTotal);
        }
    }

}
