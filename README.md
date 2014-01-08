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

1. `mkdir -p /usr/local/xdata-code-audit/deploy`
2. `mkdir -p /usr/local/xdata-code-audit/src`
3. `cd /usr/local/xdata-code-audit/`
4. `git clone https://github.com/chrismattmann/drat.git`
5. `mv drat src && cd src`
6. `mvn install`
7. `cp -R target/distribution/dms-distribution-0.1-bin.tar.gz deploy`
8. `cd deploy`
9. `tar xvzf dms-distribution-0.1-bin.tar.gz`
10. `rm -rf *.tar.gz`
11. `cp -R ../src/pge ./pge && cp -R ../src/solr/ ./solr`

How to Run
===
Here are the basic commands to run DRAT. Imagine you had a code repo, your-repo, that lives in `$HOME/your-repo`.

1. Start Apache&trade; OODT  
   `cd /usr/local/xdata-code-audit/deploy`  
   `cd filemgr/bin && ./filemgr start`  
   `cd ../../workflowbin/ && ./wmgr start`  

2. Crawl the repository of interest, e.g., `$HOME/your-repo`:  
    `cd /usr/local/xdata-code-audit/deploy/crawler/bin`  
   `./crawler_launcher --operation --metPC --productPath $HOME/your-repo --metExtractorConfig /usr/local/xdata-code-audit/deploy/extractors/code/default.cpr.conf --metExtractor org.apache.oodt.cas.metadata.extractors.CopyAndRewriteExtractor --filemgrUrl http://localhost:9000 --clientTransferer org.apache.oodt.cas.filemgr.datatransfer.InPlaceDataTransferFactory`

3. Index the crawled repo in Apache&trade; SOLR:  
   `cd /usr/local/xdata-code-audit/deploy/filemgr/bin`  
   `java -Djava.ext.dirs=../lib -DSOLR_INDEXER_CONFIG=../etc/indexer.properties org.apache.oodt.cas.filemgr.tools.SolrIndexer --all --fmUrl http://localhost:9000 --optimize --solrUrl http://localhost:8080/xdatagitsolr/xdatagit`  

4. Fire off the partitioner and mappers  
   `cd /usr/local/xdata-code-audit/deploy/workflow/bin`  
   `./wmgr-client --url http://localhost:9001 --operation --dynWorkflow --taskIds urn:xdata:MimePartitioner`  

5. Fire off the reducer  
   `cd /usr/local/xdata-code-audit/deploy/workflow/bin`  
   `./wmgr-client --url http://localhost:9001 --operation --dynWorkflow --taskIds urn:xdata:RatAggregator`  
