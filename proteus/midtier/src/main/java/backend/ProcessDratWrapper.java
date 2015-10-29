package backend;

import java.io.IOException;

/**
 * Created by stevenfrancus on 10/13/15.
 */
public class ProcessDratWrapper extends GenericProcess implements AbstractDratWrapper {
    private static final String DRAT = FileConstants.DRAT_PATH;
    private String path;
    private boolean isIndexedFlag = false;
    private ProcessProteusWrapper proteusWrapper = new ProcessProteusWrapper();
    public ProcessDratWrapper() {
        super(DRAT);
        this.path = "";
    }
    public ProcessDratWrapper(String canonicalPath) {
        this();
        this.setIndexablePath(canonicalPath);
    }
    public void setIndexablePath(String canonicalPath) {
        isIndexedFlag = !this.path.equals(canonicalPath);
        this.path = canonicalPath;
        proteusWrapper.setRepositoryPath(this.path);
    }
    public String getIndexablePath() {
        return this.path;
    }
    public int getNumberOfRatTasksRunning() throws IOException {
        return proteusWrapper.getNumberOfRatTasksRunning();
    }
    public void crawl() throws IOException {
        super.createProcess("crawl", this.path, false);
    }

    public void index() throws IOException {
        super.createProcess("index", this.path, false);
        isIndexedFlag = true;
    }

    public void map() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        super.createProcess("map", false);
    }

    public void reduce() throws IOException, DratWrapperException {
        if(!isIndexedFlag) {
            throw new DratWrapperException();
        }
        super.createProcess("reduce", false);
    }

    public void go() throws IOException {
        super.createProcess("go", this.path, true);
    }

    public boolean isRunning() throws Exception {
        return this.getNumberOfRatTasksRunning() > 0;
    }
}
