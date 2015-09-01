#!/usr/bin/env python
# -*- coding: utf-8 -*-
# Licensed to the Apache Software Foundation (ASF) under one or more
# contributor license agreements.  See the NOTICE file distributed with
# this work for additional information regarding copyright ownership.
# The ASF licenses this file to You under the Apache License, Version 2.0
# (the "License"); you may not use this file except in compliance with
# the License.  You may obtain a copy of the License at
#
#     http://www.apache.org/licenses/LICENSE-2.0
#
# Unless required by applicable law or agreed to in writing, software
# distributed under the License is distributed on an "AS IS" BASIS,
# WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
# See the License for the specific language governing permissions and
# limitations under the License.
# 
# $Id$
#
# Author: mattmann
# Description: Uses Apache Solr based catalog of code repo to partition,
# based on MIME type the distributed, map-reduce like execution of Apache
# RAT, so that RAT can complete with a reasonable amount of time.

import sys
import json
import os
import getopt
import urllib2
import xmlrpclib
urllib2.build_opener(urllib2.HTTPHandler(debuglevel=1))
solrPostfix = "/select/?q=mimetype:$type&version=2.2&start=0&rows=10&indent=on&facet=on&facet.field=mimetype&wt=json&fl=filelocation,filename"
solrPostfixByPage = "/select/?q=mimetype:$type&version=2.2&start=$i&rows=$num&indent=on&facet=on&facet.field=mimetype&wt=json&fl=filelocation,filename"

def executeRatJobs(url, num, type, workflowUrl, taskIds):
    # for i = 0 to count(records) i+=num
    # json = query Solr with solrPostFix.replace($type, type)
    # build filepath list
    # send filepath and name list to CAS-PGE RAT job
    # first get numRecords
    if not url.endswith("/"):
        url = url + "/"
    solrUrl = url+solrPostfix.replace("$type", type)
    print "GET "+solrUrl
    numFound = 0
    req = urllib2.Request(solrUrl)
    try:
        f = urllib2.urlopen(req)
        jsonResp = json.loads(f.read())
        numFound = int(jsonResp["response"]["numFound"])
    except urllib2.HTTPError, (err):
        print "HTTP error(%s)" % (err)
        print "Aborting RAT execution"
        return

    wm = xmlrpclib.Server(workflowUrl)


    for i in range(0, numFound, num):
        ratSolrUrl = url + solrPostfixByPage.replace("$type", type).replace("$i", str(i)).replace("$num",str(num))
        req = urllib2.Request(ratSolrUrl)
        f = urllib2.urlopen(req)
        jsonResp = json.loads(f.read())
        docs = jsonResp["response"]["docs"]
        metadata = {}
        metadata["MimeType"] = type
        for doc in docs:
            filename = doc["filename"][0]
            filelocation = doc["filelocation"][0]
            fullpath = None
            if not filelocation.endswith("/"):
                filelocation = filelocation + "/"
            fullpath = filelocation + filename
            if "InputFiles" not in metadata:
                metadata["InputFiles"] = []
            metadata["InputFiles"].append(fullpath)
        print "Metadata is "+str(metadata)
        wm.workflowmgr.executeDynamicWorkflow([taskIds], metadata)
        

def main(argv):
   solrUrl=''
   numFilesPerJob=0
   workflowUrl=''
   ratTaskId=''
   usage = 'mime_rat_partitioner.py -u <solrUrl> -c <numFilesPerJob> -w <workflowUrl> -t <rat task Id>'

   try:
      opts, args = getopt.getopt(argv,"hu:c:w:t:",["solrUrl=", "numFilesPerJob=", "workflowUrl=", "ratTaskId="])
   except getopt.GetoptError:
      print usage
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print usage
         sys.exit()
      elif opt in ("-u", "--solrUrl"):
         solrUrl = arg
      elif opt in ("-c", "--numFilesPerJob"):
         numFilesPerJob = int(arg)
      elif opt in ("-w", "--workflowUrl"):
          workflowUrl = arg
      elif opt in ("-t", "--ratTaskId"):
          ratTaskId = arg

   if solrUrl == "" or numFilesPerJob == 0 or workflowUrl == "" or ratTaskId == "":
       print usage
       sys.exit()


   print "Configured SOLR url: ["+solrUrl+"]"
   mimeTypes = ["x-java-source", "x-c", "javascript", "xml", "html", "css", \
   "x-json", "x-sh", "x-fortran", "csv" "tab-separated-values", "x-tex", \
   "x-asm", "x-diff", "x-python", "x-matlab"]
   for type in mimeTypes:
       print "Executing RAT for MIME: ["+type+"]: num files per job: ["+str(numFilesPerJob)+"]"
       executeRatJobs(solrUrl, numFilesPerJob, type, workflowUrl, ratTaskId)

if __name__ == "__main__":
   main(sys.argv[1:])
