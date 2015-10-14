package com.company;

/**
 * This interface abstracts the main communication methods between Apache DRAT and Proteus
 */
public interface AbstractDratWrapper {
    public void crawl();
    public void index();
    public void map();
    public void reduce();
}
