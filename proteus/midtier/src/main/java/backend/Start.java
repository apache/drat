package backend;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class Start {
    static int fileCount = 0;
    private static AbstractDratWrapper dratWrapper = ProcessDratWrapper.getInstance();
    private static AbstractOodtWrapper oodtWrapper = ProcessOodtWrapper.getInstance();
    public static void main(String[] args) {
        dratWrapper.setIndexablePath(FileConstants.DRAT_SRC);
        try {
            restartOodt();
            dratWrapper.go();
            //Thread.sleep(5000);
            //dratWrapper.getNumberOfRatTasksRunning();
        }
        catch(IOException ioe) {
            ioe.printStackTrace();
        }
        catch(Exception e) {
            e.printStackTrace();
        }
    }
    public static void restartOodt() throws IOException {
        oodtWrapper.stop();
        oodtWrapper.reset();
        oodtWrapper.run();
    }
}
