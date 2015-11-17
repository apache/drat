package drat.proteus.services.licenses;


import java.io.*;
import java.util.*;

public class RatLog {
    private String ratLog;
    private Map<String,Integer> licenseSpread;
    private List<String> unapprovedLicenseFiles;
    private boolean hasBeenParsed = false;
    private static final String SECTION_SEPARATOR = "*******";
    private static final String UNAPPROVED_LICENSES = "Unapproved licenses";
    private static List<String> LICENSE_VALUES = new ArrayList<>(); //it's a list so popping off the element can be easy
    static {
        LICENSE_VALUES.add("Notes");
        LICENSE_VALUES.add("Binaries");
        LICENSE_VALUES.add("Archives");
        LICENSE_VALUES.add("Standards");
        LICENSE_VALUES.add("Apache Licensed");
        LICENSE_VALUES.add("Generated");
    }
    private static final String UNKNOWN = "Unknown Licenses";
    public RatLog(String log) {
        this.ratLog = log;
        licenseSpread = new HashMap<>();
        unapprovedLicenseFiles = new ArrayList<>();
    }

    public RatLog parse() {
        if(!hasBeenParsed) {
            try {
                parseFileLineByLine();
                hasBeenParsed = true;
            }
            catch(IOException ioe) {
                ioe.printStackTrace();
            }
        }
        return this;
    }

    public Map<String, Integer> getLicenseHistogram() {
        return this.licenseSpread;
    }

    public List<String> getUnapprovedLicenseFiles() { return this.unapprovedLicenseFiles; }

    private void parseFileLineByLine() throws IOException {
        String[] lines = this.ratLog.split("\n");
        List<Integer> sectionDelimiters = getSectionDelimiters(lines);
        //the first two delimiters (0 and 1) represent the bounds of the header
        for(int i = sectionDelimiters.get(0) + 1; i < sectionDelimiters.get(1); i++) {
            parseHeader(lines[i]);
        }
        //the next two (1 and 2) represent the unapproved licenses bounds
        for(int i = sectionDelimiters.get(1) + 1; i < sectionDelimiters.get(2); i++) {
            parseUnapprovedFiles(lines[i]);
        }
    }

    private List<Integer> getSectionDelimiters(String[] lines) {
        List<Integer> sectionDelimiters = new ArrayList<Integer>();
        for(int i = 0; i < lines.length; i++) {
            if(lines[i].startsWith(SECTION_SEPARATOR)) {
                sectionDelimiters.add(i);
            }
        }
        return sectionDelimiters;
    }

    private boolean parseHeader(String line) {
        for(String licenseType: LICENSE_VALUES) {
            if(line.startsWith(licenseType + ":")) {
                String lineParts[] = line.split(":");
                if(lineParts.length > 1) {
                    licenseSpread.put(licenseType, Integer.parseInt((lineParts[1]).trim()));
                }
                LICENSE_VALUES.remove(licenseType);
                return true;
            }
        }
        if(line.contains(UNKNOWN)) {
            licenseSpread.put(UNKNOWN, Integer.parseInt((line.split(" ")[0]).trim()));
            return false;
        }
        return true;
    }

    public void parseUnapprovedFiles(String line) {
        line = line.trim();
        if(line.length() > 0) { //check if line is just whitespace
            if(!line.startsWith(UNAPPROVED_LICENSES)) { //if it's not just white space, check if it is a file path or not
                unapprovedLicenseFiles.add(line);
            }
        }
    }
}
