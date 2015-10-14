package com.company;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class Start {
    static int fileCount = 0;
    private static AbstractDratWrapper dratWrapper = new DratWrapper();
    private static AbstractOodtWrapper oodtWrapper = new OodtWrapper();
    public static void main(String[] args) {
        String dratPath = (args[0] != null) ? args[0] : FileConstants.DRAT_SRC;
        restartOodt();
    }
    public static void restartOodt() {
        oodtWrapper.stop();
        oodtWrapper.reset();
        oodtWrapper.run();
    }
}
