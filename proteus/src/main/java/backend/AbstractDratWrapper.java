package backend;


import drat.proteus.services.general.DratServiceStatus;

/**
 * This interface abstracts the main communication methods between Apache DRAT and Proteus
 */
public interface AbstractDratWrapper {
    public void crawl() throws Exception;
    public void index() throws Exception;
    public void map() throws Exception;
    public void reduce() throws Exception;
    public void go() throws Exception;
    public void reset() throws Exception;
    public void setIndexablePath(String path);
    public String getIndexablePath();
    public DratServiceStatus getDratStatus();
}
