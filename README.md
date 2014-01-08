Distributed Release Audit Tool (DRAT)
====

A distributed, parallelized (Map Reduce) wrapper around Apache&trade; RAT to allow it to complete on large code repositories of multiple file types where Apache&trade; RAT hangs forever.

The tool leverages Apache&trade; OODT to parllelize ane workflow together the following components:

1. Apache&trade; SOLR based exploration of a CM repository (e.g., Git, SVN, etc.) and classification of that repository based on MIME type using Apache&trade; Tika.
2. A MIME partitioner that uses Apache&trade; Tika to automatically deduce and classify by file type and then partition Apache&trade; RAT jobs based on sets of 100 files per type (configurable) -- the M/R "partitioner"
3. A throttle wrapper for RAT to MIME targeted Apache&trade; RAT. -- the M/R "mapper"
4. A reducer to "combine" the produced RAT logs together into a global RAT report that can be used for stats generation. -- the M/R "reducer"


