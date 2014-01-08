#!/usr/bin/env python
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
# Description: Grabs all RAT log files specified on standard in from a root dir
# and then adds up the following stats from them:
#
# Notes, Binaries, Archives, Standards, Apache Licensed, Generated Documents
# Unkown Licenses

import sys
import os
import getopt


def parseFile(filepath):
   f = open(filepath, 'r')
   lines = f.readlines()
   notes = 0
   binaries = 0
   archives = 0
   standards = 0
   apachelicensed = 0
   generated = 0
   unknown = 0

   for line in lines:
      if line.startswith('Notes:'):
         notes = notes + int(line.split(':')[1].strip())
      if line.startswith('Binaries:'):
         binaries = binaries + int(line.split(':')[1].strip())
      if line.startswith('Archives:'):
         archives = archives + int(line.split(':')[1].strip())
      if line.startswith('Standards:'):
         standards = standards + int(line.split(':')[1].strip())
      if line.startswith('Apache Licensed:'):
         apachelicensed = apachelicensed + int(line.split(':')[1].strip())
      if line.startswith('Generated:'):
         generated = generated + int(line.split(':')[1].strip())
      if line.find('Unknown Licenses') != -1:
         unknown = unknown + int(line.split(' ')[0].strip())
         return (notes, binaries,archives,standards,apachelicensed,generated,unknown)
         
   return (-1,-1,-1,-1,-1,-1,-1)

def main(argv=None):
   usage = 'rat_aggregator.py logfile1 logfile2 ... logfileN'

   if len(argv) == 0:
       print usage
       sys.exit()

   totalNotes = 0
   totalBinaries = 0
   totalArchives = 0
   totalStandards = 0
   totalApache = 0
   totalGenerated = 0
   totalUnknown = 0

   for file in argv:
      (notes, binaries, archives,standards,apachelicensed,generated,unknown) = parseFile(file)
      totalNotes = totalNotes + notes
      totalBinaries = totalBinaries + binaries
      totalArchives = totalArchives + archives
      totalStandards = totalStandards + standards
      totalApache = totalApache + apachelicensed
      totalGenerated = totalGenerated + generated
      totalUnknown = totalUnknown + unknown

   print "Notes,Binaries,Archives,Standards,Apache,Generated,Unknown"
   print str(totalNotes)+","+str(totalBinaries)+","+str(totalArchives)+","+str(totalStandards)+","+str(totalApache)+","+str(totalGenerated)+","+str(totalUnknown)
      

if __name__ == "__main__":
   main(sys.argv[1:])
