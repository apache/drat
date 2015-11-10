Distributed Release Audit Tool (DRAT)
====

A distributed, parallelized (Map Reduce) wrapper around [Apache&trade; RAT](http://creadur.apache.org/rat/) (Release Audit Tool). RAT is used to check for proper licensing in software projects. However, RAT takes a prohibitively long time to analyze large repositories of code, since it can only run on one JVM. Furthermore, RAT isn't customizable by file type or file size and provides no incremental output. This wrapper dramatically speeds up the process by leveraging Apache&trade; OODT to parallelize and workflow the following components:

1. Apache&trade; Solr based exploration of a CM repository (e.g., Git, SVN, etc.) and classification of that repository based on MIME type using Apache&trade; Tika.
2. A MIME partitioner that uses Apache&trade; Tika to automatically deduce and classify by file type and then partition Apache&trade; RAT jobs based on sets of 100 files per type (configurable) -- the M/R "partitioner"
3. A throttle wrapper for RAT to MIME targeted Apache&trade; RAT. -- the M/R "mapper"
4. A reducer to "combine" the produced RAT logs together into a global RAT report that can be used for stats generation. -- the M/R "reducer"

See the wiki for more information on installing and running DRAT:  
* [Installation instructions](https://github.com/chrismattmann/drat/wiki/Installation)  
* [How to run](https://github.com/chrismattmann/drat/wiki/How-to-Run)  
* [How to re-run](https://github.com/chrismattmann/drat/wiki/Re-running-DRAT)  
* [How to interact with DRAT](https://github.com/chrismattmann/drat/wiki/Interacting-with-DRAT)  
* [Vagrant setup](https://github.com/chrismattmann/drat/wiki/Vagrant)
* [Excluding files from analysis](https://github.com/chrismattmann/drat/wiki/RegEx-exclude-file)
* [Running DRAT on multiple repositories](https://github.com/chrismattmann/drat/wiki/DRAT-Sequential)

You can clone the wiki by running  
`git clone https://github.com/chrismattmann/drat.wiki.git`