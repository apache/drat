Apache Distributed Release Audit Tool (DRAT)&trade;
====
 
A distributed, parallelized (Map Reduce) wrapper around [Apache RAT&trade;](http://creadur.apache.org/rat/) (Release Audit Tool). RAT is used to check for proper licensing in software projects. However, RAT takes a prohibitively long time to analyze large repositories of code, since it can only run on one JVM. Furthermore, RAT isn't customizable by file type or file size and provides no incremental output. This wrapper dramatically speeds up the process by leveraging Apache OODT&trade; to parallelize and workflow the following components:

1. Apache Solr&trade; based exploration of a CM repository (e.g., Git, SVN, etc.) and classification of that repository based on MIME type using Apache Tika&trade;.
2. A MIME partitioner that uses Apache Tika&trade; to automatically deduce and classify by file type and then partition Apache RAT&trade; jobs based on sets of 100 files per type (configurable) -- the M/R "partitioner"
3. A throttle wrapper for RAT to MIME targeted Apache&trade; RAT. -- the M/R "mapper"
4. A reducer to "combine" the produced RAT logs together into a global RAT report that can be used for stats generation. -- the M/R "reducer"

See the wiki for more information on installing and running DRAT:  
* [Installation instructions](https://github.com/apache/drat/wiki/Installation)  
* [How to run](https://github.com/apache/drat/wiki/How-to-Run)  
* [How to re-run](https://github.com/apache/drat/wiki/Re-running-DRAT)  
* [How to interact with DRAT](https://github.com/apache/drat/wiki/Interacting-with-DRAT)  
* [Vagrant setup](https://github.com/apache/drat/wiki/Vagrant)
* [Excluding files from analysis](https://github.com/apache/drat/wiki/RegEx-exclude-file)
* [Running DRAT on multiple repositories](https://github.com/apache/drat/wiki/DRAT-Sequential)
* [Running the DRAT Proteus GUI](https://github.com/apache/drat/wiki/Proteus---A-GUI-for-DRAT)

You can clone the wiki by running  
`git clone https://github.com/apache/drat.wiki.git`

Visit our new website [drat.apache.org](https://drat.apache.org/) at the [Apache Software Foundation](https://www.apache.org/).

---

Current build status: [![Build Status](https://travis-ci.org/apache/drat.svg?branch=master)](https://travis-ci.org/apache/drat)
