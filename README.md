Distributed Release Audit Tool (DRAT)
====

A distributed, parallelized (Map Reduce) wrapper around Apache&trade; RAT to allow it to complete on large code repositories of multiple file types where Apache&trade; RAT hangs forever.

The tool leverages Apache&trade; OODT to parallelize and workflow together the following components:

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

How to Run
===
Here are the basic commands to run DRAT. Imagine you had a code repo, your-repo, that lives in `$HOME/your-repo`.

1. Set your `$DRAT_HOME` environment variable, e.g., to `/usr/local/drat/deploy`

2. Start Apache&trade; OODT:  
   `cd $DRAT_HOME/bin`  
   `./oodt start`  

3. Crawl the repository of interest, e.g., `$HOME/your-repo`:  
    `cd $DRAT_HOME/crawler/bin`  
   `./crawler_launcher --operation --metPC --productPath $HOME/your-repo --metExtractorConfig $DRAT_HOME/extractors/code/default.cpr.conf --metExtractor org.apache.oodt.cas.metadata.extractors.CopyAndRewriteExtractor --filemgrUrl http://localhost:9000 --clientTransferer org.apache.oodt.cas.filemgr.datatransfer.InPlaceDataTransferFactory`

4. Index the crawled repo in Apache&trade; SOLR:  
   `cd $DRAT_HOME/filemgr/bin`  
   `java -Djava.ext.dirs=../lib -DSOLR_INDEXER_CONFIG=../etc/indexer.properties org.apache.oodt.cas.filemgr.tools.SolrIndexer --all --fmUrl http://localhost:9000 --optimize --solrUrl http://localhost:8080/solr/drat`  

5. Fire off the partitioner and mappers  
   `cd $DRAT_HOME/workflow/bin`  
   `./wmgr-client --url http://localhost:9001 --operation --dynWorkflow --taskIds urn:drat:MimePartitioner`  

6. Fire off the reducer  
   `cd $DRAT_HOME/workflow/bin`  
   `./wmgr-client --url http://localhost:9001 --operation --dynWorkflow --taskIds urn:drat:RatAggregator`  
   
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

If you want to analyze an entirely new code base, then you will want to:

1. Shut down OODT by:  
   `cd $DRAT_HOME/bin && ./oodt stop`  

2. Blow away the following dirs:  
   `rm -rf $DRAT_HOME/data/workflow`  
   `rm -rf $DRAT_HOME/filemgr/catalog`  
   
3. Blow away files in following dirs:  
   `rm -rf $DRAT_HOME/data/archive/*`  
   
4. Restart OODT by:  
   `cd $DRAT_HOME/bin && ./oodt start`  
   

Useful Environment Variables
==
The following useful environment variables are set by RADIX but can be overwritten
on a per DRAT install basis. Here's the default confg, feel free to change/override
in your own environment.

```
setenv DRAT_HOME /usr/local/drat/deploy
setenv FILEMGR_URL http://localhost:9000
setenv WORKFLOW_URL http://localhost:9001
setenv RESMGR_URL http://localhost:9002
setenv DRAT_HOME /usr/local/drat/deploy
setenv WORKFLOW_HOME $DRAT_HOME/workflow
setenv FILEMGR_HOME $DRAT_HOME/filemgr
setenv PGE_ROOT $DRAT_HOME/pge
setenv PCS_HOME $DRAT_HOME/pcs
setenv GANGLIA_URL http://zipper.jpl.nasa.gov/ganglia/
```

Note the tomcat that we ship with DRAT won't start correctly unless you
define the `$JAVA_HOME` environment variable, so make sure that's set too.
