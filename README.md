Distributed Release Audit Tool (DRAT)
====

A distributed, parallelized (Map Reduce) wrapper around [Apache&trade; RAT](http://creadur.apache.org/rat/) (Release Audit Tool). RAT is used to check for proper licensing in software projects. However, RAT takes a prohibitively long time to analyze large repositories of code, since it can only run on one JVM. Furthermore, RAT isn't customizable by file type or file size and provides no incremental output. This wrapper dramatically speeds up the process by leveraging Apache&trade; OODT to parallelize and workflow the following components:

1. Apache&trade; SOLR based exploration of a CM repository (e.g., Git, SVN, etc.) and classification of that repository based on MIME type using Apache&trade; Tika.
2. A MIME partitioner that uses Apache&trade; Tika to automatically deduce and classify by file type and then partition Apache&trade; RAT jobs based on sets of 100 files per type (configurable) -- the M/R "partitioner"
3. A throttle wrapper for RAT to MIME targeted Apache&trade; RAT. -- the M/R "mapper"
4. A reducer to "combine" the produced RAT logs together into a global RAT report that can be used for stats generation. -- the M/R "reducer"

How to Build
===
You can build DRAT in a few steps:

1. `mkdir -p /usr/local/drat/deploy`
2. `mkdir -p /usr/local/drat/src`
3. `cd /usr/local/drat/src`
4. `git clone https://github.com/chrismattmann/drat.git .`
5. `mvn install`
6. `cp -R distribution/target/dms-distribution-0.1-bin.tar.gz ../deploy/`
7. `cd ../deploy/`
8. `tar xvzf dms-distribution-0.1-bin.tar.gz`
9. `rm *.tar.gz`

Running with Vagrant
===

Prerequisites:

Install Vagrant from [here](http://www.vagrantup.com/).

Install VirtualBox from [here](https://www.virtualbox.org/).

```
git clone https://github.com/chrismattmann/drat.git
cd drat
vagrant up
vagrant ssh
```

Skip to automated method or manual method. Note that the /vagrant directory is a shared 
folder to your host system and is a great way to interact with codebases you're looking to 
audit with drat.



How to Run
===
Here are the basic commands to run DRAT. Imagine you had a code repo, your-repo, that lives in `$HOME/your-repo`.

1. Set your `$DRAT_HOME` environment variable, e.g., to `/usr/local/drat/deploy`.
   Note the tomcat that we ship with DRAT won't start correctly unless you define 
   the `$JAVA_HOME` environment variable, so make sure that's set too.

2. Start Apache&trade; OODT:  
   `$DRAT_HOME/bin/oodt start`

### Automated method:
3. Go!  
   `$DRAT_HOME/bin/drat go $HOME/your-repo`  
   This will crawl the repo, index it, map it and then wait for the reduce to complete.  

### Manual method:
If you would rather run the individual commands yourself, use the manual method:

3. Crawl the repository of interest, e.g., `$HOME/your-repo`:  
   `$DRAT_HOME/bin/drat crawl $HOME/your-repo`

4. Index the crawled repo in Apache&trade; SOLR:  
   `$DRAT_HOME/bin/drat index $HOME/your-repo`

5. Fire off the partitioner and mappers  
   `$DRAT_HOME/bin/drat map`

6. Fire off the reducer  
   `$DRAT_HOME/bin/drat reduce`

Please see `$DRAT_HOME/bin/drat` for the specifics of each command. To shut down OODT, run `$DRAT_HOME/bin/oodt stop`.
   
Interacting with DRAT
==
DRAT UIs are accessible at:

http://localhost:8080/opsui/ - main cockpit, Apache OODT OPSUI  
http://localhost:8080/solr/ - Solr4 catalog  

DRAT publishes its analyzed aggregated RAT logs to:

`$DRAT_HOME/data/archive/rataggregate/*.csv`

These look like e.g.

```
cat *.csv
Notes,Binaries,Archives,Standards,Apache,Generated,Unknown
0,2,0,530,497,0,33
```

So, these are the counts of each of the source code files and what licenses they are:

```
Binaries - it's a binary file, no license
Notes - it's a notes file
Archives - it's a tar/zip/etc archive, no license
Standards - it's one of the OSI approved licenses that isn't ALv2, so e.g., BSD, MIT, LGPL, etc.
Generated - these are generated files (either source or binary)
Apache - apache licensed files
Unknown - non discernible license
```

Re-Running DRAT 
==
If you run DRAT on your source code and want to run it again the easiest way to do so is to:

1. Grab the aliases for fmquery and fmdel from https://issues.apache.org/jira/browse/OODT-306 
   and add them to your bash or tcsh profile:  
   
2. Run 
   `fmquery "ProductType:RatLog" | fmdel`  

3. Run 
   `fmquery "ProductType:RatAggregateLog" | fmdel`  

You should be good to go to re-run the analysis at that point.

##If you want to analyze an entirely new code base
   `$DRAT_HOME/bin/oodt stop`  
   `$DRAT_HOME/bin/drat reset`  
   `$DRAT_HOME/bin/oodt start`

**You shouldn't need to run these**, but the manual version of `reset` is:

1. Blow away the following dirs:  
   `rm -rf $DRAT_HOME/data/workflow`  
   `rm -rf $DRAT_HOME/filemgr/catalog`  
   `rm -rf $DRAT_HOME/solr/drat/data`
   
2. Blow away files in following dirs:  
   `rm -rf $DRAT_HOME/data/archive/*`  

Useful Environment Variables
==
The following useful environment variables are set by RADIX but can be overwritten
on a per DRAT install basis. Here's the default config, feel free to change/override
in your own environment.

```
setenv DRAT_HOME /usr/local/drat/deploy
setenv FILEMGR_URL http://localhost:9000
setenv WORKFLOW_URL http://localhost:9001
setenv RESMGR_URL http://localhost:9002
setenv WORKFLOW_HOME $DRAT_HOME/workflow
setenv FILEMGR_HOME $DRAT_HOME/filemgr
setenv PGE_ROOT $DRAT_HOME/pge
setenv PCS_HOME $DRAT_HOME/pcs
setenv GANGLIA_URL http://zipper.jpl.nasa.gov/ganglia/

Running DRAT on XDATA and the Computational Infrastructure for Geodynamics
===
There is now a [Youtube video on DRAT](https://www.youtube.com/watch?v=9w3fpnNWdIE) 
explaining DRAT's motivation, and results of running it on 
[DARPA XDATA](http://www.darpa.mil/Our_Work/I2O/Programs/XDATA.aspx) and on the 
[Computational Infrastructure for Geodynamics](http://www.geodynamics.org/cig/) as
part of the [my NSF project](https://github.com/chrismattmann/earthcube/).
The video was made for the 
[2014 Summer Earth Science Information Partners Federation Meeting](http://commons.esipfed.org/2014SummerMeeting).
 
