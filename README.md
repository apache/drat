Distributed Release Audit Tool (DRAT)
====

A distributed, parallelized (Map Reduce) wrapper around Apache&trade; RAT to allow it to complete on large code repositories of multiple file types where Apache&trade; RAT hangs forever.

The tool leverages Apache&trade; OODT to parllelize ane workflow together the following components:

1. Apache&trade; SOLR based exploration of a CM repository (e.g., Git, SVN, etc.) and classification of that repository based on MIME type using Apache&trade; Tika.
2. A MIME partitioner that uses Apache&trade; Tika to automatically deduce and classify by file type and then partition Apache&trade; RAT jobs based on sets of 100 files per type (configurable) -- the M/R "partitioner"
3. A throttle wrapper for RAT to MIME targeted Apache&trade; RAT. -- the M/R "mapper"
4. A reducer to "combine" the produced RAT logs together into a global RAT report that can be used for stats generation. -- the M/R "reducer"

How to Build
===
You can build DRAT in a few steps:

1. `mkdir -p /usr/local/drat/deploy`
2. `mkdir -p /usr/local/drat/src`
3. `cd /usr/local/drat/`
4. `git clone https://github.com/chrismattmann/drat.git`
5. `mv drat src && cd src`
6. `mvn install`
7. `cp -R target/distribution/dms-distribution-0.1-bin.tar.gz deploy`
8. `cd deploy`
9. `tar xvzf dms-distribution-0.1-bin.tar.gz`
10. `rm -rf *.tar.gz`

How to Run
===
Here are the basic commands to run DRAT. Imagine you had a code repo, your-repo, that lives in `$HOME/your-repo`.

1. Set your `$DRAT_HOME` environment variable, e.g., to `/usr/local/drat/deploy`

2. Start Apache&trade; OODT  
   `cd $DRAT_HOME`  
   `cd filemgr/bin && ./filemgr start`  
   `cd ../../workflowbin/ && ./wmgr start`  

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
