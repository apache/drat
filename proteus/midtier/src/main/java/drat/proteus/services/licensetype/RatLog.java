package drat.proteus.services.licensetype;


import java.io.*;
import java.util.*;

/**
 * Created by stevenfrancus on 11/13/15.
 */
public class RatLog {
    private String ratLog;
    private Map<String,Integer> licenseSpread;
    private boolean hasBeenParsed = false;
    private static final String[] LICENSE_VALUES = {
            "Notes",
            "Binaries",
            "Archives",
            "Standards",
            "Apache Licensed",
            "Generated"
    };
    private static final String UNKNOWN = "Unknown Licenses";
    public RatLog(String log) {
        this.ratLog = log;
        licenseSpread = new HashMap<>();
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

    private void parseFileLineByLine() throws IOException {
        String[] lines = this.ratLog.split("\n");
        System.out.println();
        for(String line: lines) {
            boolean continueParsing = parseFileLine(line);
            if(!continueParsing) {
                break;
            }
        }
    }
    private boolean parseFileLine(String line) {
        for(String licenseType: LICENSE_VALUES) {
            if(line.startsWith(licenseType + ":")) {
                String lineParts[] = line.split(":");
                if(lineParts.length > 1) {
                    licenseSpread.put(licenseType, Integer.parseInt((lineParts[1]).trim()));
                }
                return true;
            }
        }
        if(line.contains(UNKNOWN)) {
            licenseSpread.put(UNKNOWN, Integer.parseInt((line.split(" ")[0]).trim()));
            return false;
        }
        return true;
    }
}
