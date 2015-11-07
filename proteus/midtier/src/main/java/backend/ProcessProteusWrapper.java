package backend;

import java.io.IOException;

/**
 * This class interfaces directly with the proteus bash script which holds auxiliary methods needed for data logs
 * by Proteus (it had to be separate from ProcessDratWrapper for OOP and bash reasons)
 */
public class ProcessProteusWrapper extends GenericProcess {
    private static final String PROTEUS = FileConstants.buildDratSubdirectoryPath("proteus");
    private String path = "";
    public ProcessProteusWrapper() {
        super(PROTEUS);
    }
    public int getNumberOfRatTasksRunning() throws IOException {
        super.createProcess("current_pges");
        return 0;
    }
    public String getRepositoryPath() {
        return this.path;
    }
    public void setRepositoryPath(String repositoryPath) {
        this.path = repositoryPath;
    }
}
