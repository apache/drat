package backend;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public interface AbstractOodtWrapper {
    public void run() throws IOException;
    public void reset() throws IOException;
    public void stop() throws IOException;
    public boolean isRunning();
}
