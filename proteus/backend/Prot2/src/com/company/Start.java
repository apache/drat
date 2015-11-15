package com.company;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class Start {
    static int fileCount = 0;
    private static AbstractDratWrapper dratWrapper = new ProcessDratWrapper();
    private static AbstractOodtWrapper oodtWrapper = new ProcessOodtWrapper();
    public static void main(String[] args) {
        String dratPath = (args[0] != null) ? args[0] : FileConstants.DRAT_SRC;
        try {
            restartOodt();
        }
        catch(IOException ioe) {
            ioe.printStackTrace();
        }
    }
    public static void restartOodt() throws IOException {
        oodtWrapper.stop();
        oodtWrapper.reset();
        oodtWrapper.run();
    }
}
