package backend;

import java.io.IOException;

public interface AbstractOodtWrapper {
    public void run() throws IOException;
    public void stop() throws IOException;
    public boolean isRunning();
}
