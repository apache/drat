package com.company;


/**
 * This interface abstracts the main communication methods between Apache DRAT and Proteus
 */
public interface AbstractDratWrapper {
    public void crawl() throws Exception;
    public void index() throws Exception;
    public void map() throws Exception;
    public void reduce() throws Exception;
}
