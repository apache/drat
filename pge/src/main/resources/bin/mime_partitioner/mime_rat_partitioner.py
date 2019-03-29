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
import getopt
import urllib
from urllib.request import urlopen, Request
from xmlrpc import client

#urllib.request.build_opener(urllib.HTTPHandler(debuglevel=1))
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
    print("GET "+solrUrl)
    numFound = 0
    req = Request(solrUrl)
    try:
        f = urlopen(req)
        jsonResp = json.loads(f.read().decode('utf-8'))
        numFound = int(jsonResp["response"]["numFound"])
    except urllib.error.HTTPError as err:
        print("HTTP error(%s)" % (err))
        print("Aborting RAT execution")
        return

    wm = client.Server(workflowUrl)


    for i in range(0, numFound, num):
        ratSolrUrl = url + solrPostfixByPage.replace("$type", type).replace("$i", str(i)).replace("$num",str(num))
        req = Request(ratSolrUrl)
        f = urlopen(req)
        jsonResp = json.loads(f.read().decode('utf-8'))
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

        print("Metadata is "+str(metadata))
        wm.workflowmgr.executeDynamicWorkflow([taskIds], metadata)
        

def get_mime_types(solrUrl):
    neg_mimetype = ["image", "application", "text", "video", "audio", "message", "multipart"]
    connection = urlopen(solrUrl + "/select?q=*%3A*&rows=0&facet=true&facet.field=mimetype&wt=python&indent=true")
    response = eval(connection.read())
    mime_count = response["facet_counts"]["facet_fields"]["mimetype"]
    stats = {}
    for i in range(0, len(mime_count), 2):
        if mime_count[i].split("/")[0] not in neg_mimetype:
            stats[mime_count[i]] = mime_count[i + 1]
    return stats.keys()


def main(argv):
   solrUrl=''
   numFilesPerJob=0
   workflowUrl=''
   ratTaskId=''
   usage = 'mime_rat_partitioner.py -u <solrUrl> -c <numFilesPerJob> -w <workflowUrl> -t <rat task Id>'

   try:
      opts, args = getopt.getopt(argv,"hu:c:w:t:",["solrUrl=", "numFilesPerJob=", "workflowUrl=", "ratTaskId="])
   except getopt.GetoptError:
      print(usage)
      sys.exit(2)
   for opt, arg in opts:
      if opt == '-h':
         print(usage)
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
       print(usage)
       sys.exit()


   print("Configured SOLR url: ["+solrUrl+"]")
   mimeTypes = get_mime_types(solrUrl)

   for type in mimeTypes:
       print("Executing RAT for MIME: ["+type+"]: num files per job: ["+str(numFilesPerJob)+"]")
       executeRatJobs(solrUrl, numFilesPerJob, type, workflowUrl, ratTaskId)

if __name__ == "__main__":
   main(sys.argv[1:])
