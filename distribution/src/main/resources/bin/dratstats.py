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

# This script collects statistics from DRAT run on multiple repositories.
# Please see help() method to understand the usage

# author: karanjeets


import sys
import os
import subprocess
import time
import shutil
import datetime
import csv
import urllib2
import json
import xmlrpclib

# Check for environment variables
def check_env_var():
	if os.getenv("DRAT_HOME") == None:
		print "Environment variable $DRAT_HOME is not set."
		sys.exit(1)
	if os.getenv("JAVA_HOME") == None:
		print "Environment variable $JAVA_HOME is not set."
		sys.exit(1)
	if os.getenv("OPSUI_URL") == None:
		print "Environment variable $OPSUI_URL is not set."
		sys.exit(1)
	if os.getenv("SOLR_URL") == None:
		print "Environment variable $SOLR_URL is not set."
		sys.exit(1)
	if os.getenv("WORKFLOW_URL") == None:
		print "Environment variable $WORKFLOW_URL is not set."
		sys.exit(1)


# Returns Current Date Time
def current_datetime():
	dt = datetime.datetime.now()
	return dt.strftime("%Y-%m-%dT%H:%M:%SZ")


# Returns a normalized path. 
# Removes the first "/" character and replaces remaining "/" with "_"
def normalize_path(repository):
	tmp = repository[repository.index("/") + 1:]
	tmp = tmp.replace("/", "_")
	tmp = tmp + "_" + current_datetime()
	return tmp


# Prints usage of this script
def help():
	print >>sys.stderr, "\n\nUsage: python dratstats.py <path to list of repository URLs> <path to output directory>\n"


# OODT Process (start, stop)
def oodt_process(command):
	try:
		retcode = subprocess.call("${DRAT_HOME}/bin/oodt" + " " + command, shell=True)
		if retcode < 0:
			print >>sys.stderr, "ODDT process was terminated by signal", -retcode, ". OODT failed to " + command + ". Aborting..."
			sys.exit(1)
		elif retcode > 0:
			print >>sys.stderr, "OODT process returned", retcode, ". OODT failed to " + command + ". Aborting..."
			sys.exit(1)
	except OSError as e:
		print >>sys.stderr, "OODT execution failed:", e, ". OODT failed to " + command + ". Aborting..."
		sys.exit(1)


# DRAT process (crawl, index, map, reduce)
def drat_process(command, repository):
	retval = True
	try:
		retcode = 0
		if command == "crawl" or command == "index":
			retcode = subprocess.call("${DRAT_HOME}/bin/drat" + " " + command + " " + repository, shell=True)
		elif command == "map" or command == "reduce":
			retcode = subprocess.call("${DRAT_HOME}/bin/drat" + " " + command, shell=True)
		if retcode < 0:
			print >>sys.stderr, "DRAT " + command + " process was terminated by signal", -retcode, ". Aborting..."
			retval = False
		elif retcode > 0:
			print >>sys.stderr, "DRAT " + command + " process returned", retcode, ". Aborting..."
			retval = False
	except OSError as e:
		print >>sys.stderr, "DRAT " + command + " execution failed:", e, ". Aborting..."
		retval = False
	return retval


# Reset DRAT
def drat_reset():
	print "Removing  " + os.getenv("DRAT_HOME") + "/data/workflow"
	shutil.rmtree(os.getenv("DRAT_HOME") + "/data/workflow")
	print "Removing  " + os.getenv("DRAT_HOME") + "/filemgr/catalog"
	shutil.rmtree(os.getenv("DRAT_HOME") + "/filemgr/catalog")
	print "Removing  " + os.getenv("DRAT_HOME") + "/solr/drat/data"
	shutil.rmtree(os.getenv("DRAT_HOME") + "/solr/drat/data")
	print "Removing  " + os.getenv("DRAT_HOME") + "/data/archive"
	shutil.rmtree(os.getenv("DRAT_HOME") + "/data/archive")
	os.mkdir(os.getenv("DRAT_HOME") + "/data/archive")
	print "Removing  " + os.getenv("DRAT_HOME") + "/data/jobs"
	shutil.rmtree(os.getenv("DRAT_HOME") + "/data/jobs")
	os.mkdir(os.getenv("DRAT_HOME") + "/data/jobs")


# Check if there are any pending PGE jobs in the queue
def job_in_queue(job_name):
	status = "PGE EXEC"
	server = xmlrpclib.ServerProxy(os.getenv("WORKFLOW_URL"), verbose=False)
	response = server.workflowmgr.getWorkflowInstancesByStatus(status)

	for i in range(0, len(response)):
		#print response[i]["sharedContext"]["TaskId"]
		if response[i]["sharedContext"]["TaskId"][0] == job_name:
			return True

	return False


# Wait for job to complete
def wait_for_job(job_name):
	while job_in_queue(job_name):
		for i in range(1, 11):
			sys.stdout.write('.')
			sys.stdout.flush()
			time.sleep(2)


# Run DRAT and collect statistics
def run(repos_list, output_dir):
	with open(repos_list) as repositories:
		for repository in repositories:
			repository = repository.strip()
			print "\nVerifying repository path...\n"
			if not os.path.exists(repository):
				print "\nPath " + repository + "is not valid. Skipping and moving on...\n"
				continue
			print "\nRepository Path: OK\n"

			print "\nStarting OODT...\n"
			oodt_process("start")
			time.sleep(20)
			print "\nOODT Started: OK\n"

			print "\nRunning DRAT on " + repository + " ...\n"
			
			retval = True
			stats = {}
			stats['id'] = repository

			stats['crawl_start'] = current_datetime()
			retval = drat_process("crawl", repository)
			stats['crawl_end'] = current_datetime()

			if retval:
				time.sleep(5)
				stats['index_start'] = current_datetime()
				retval = drat_process("index", repository)
				stats['index_end'] = current_datetime()

				if retval:
					time.sleep(5)
					stats['map_start'] = current_datetime()
					retval = drat_process("map", None)
					time.sleep(5)
					wait_for_job("urn:drat:MimePartitioner")
					wait_for_job("urn:drat:RatCodeAudit")
					stats['map_end'] = current_datetime()

					if retval:
						time.sleep(5)
						stats['reduce_start'] = current_datetime()
						drat_process("reduce", None)
						time.sleep(5)
						wait_for_job("urn:drat:RatAggregator")
						stats['reduce_end'] = current_datetime()
						print "\nDRAT Scan Completed: OK\n"

			time.sleep(5)

			if retval:
				# Copy Data with datetime variables above, extract output from RatAggregate file, extract data from Solr Core
				print "\nCopying data to Solr and Output Directory...\n"
				
				# Extract data from RatAggregate File
				aggregate_dir = os.getenv("DRAT_HOME") + "/data/archive/rataggregate"
				for cur_file in os.listdir(aggregate_dir):
					rat_aggregate = cur_file
					break

				if rat_aggregate != None and os.path.isfile(aggregate_dir + "/" + rat_aggregate):
					with open(aggregate_dir + "/" + rat_aggregate) as input:
						reader = csv.reader(input)
						content = list(reader)

					header = content[0]
					license_count = content[1]

					for i in range(0, len(header)):
						stats["license_" + header[i]] = license_count[i]


					# Extract data from Solr
					neg_mimetype = ["image", "application", "text", "video", "audio", "message", "multipart"]
					connection = urllib2.urlopen(os.getenv("SOLR_URL") + "/drat/select?q=*%3A*&rows=0&facet=true&facet.field=mimetype&wt=python&indent=true")
					response = eval(connection.read())
					mime_count = response["facet_counts"]["facet_fields"]["mimetype"]

					for i in range(0, len(mime_count), 2):
						if mime_count[i].split("/")[0] not in neg_mimetype:
							stats["mime_" + mime_count[i]] = mime_count[i + 1]


					# Write data into Solr
					stats_data = []
					stats_data.append(stats)
					json_data = json.dumps(stats_data)
					print json_data
					request = urllib2.Request(os.getenv("SOLR_URL") + "/statistics/update/json?commit=true")
					request.add_header('Content-type', 'application/json')
					urllib2.urlopen(request, json_data)

					# Copying data to Output Directory
					repos_out = output_dir + "/" + normalize_path(repository)
					shutil.copytree(os.getenv("DRAT_HOME") + "/data", repos_out)
					print "\nData copied to Solr and Output Directory: OK\n"

				else:
					print "\nRatAggregate file is not present. No data was copied\n"

			else:
				print "\nDRAT Scan Completed: Resulted in Error\n"


			time.sleep(5)
			print "\nStopping OODT...\n"
			oodt_process("stop")
			time.sleep(20)
			print "\nOODT Stopped: OK\n"

			print "\nReseting DRAT...\n"
			drat_reset()
			time.sleep(5)
			print "\nDRAT Reset: OK\n"

	print "\nDRAT SCAN COMPLETED!!!\n"


# This is where it all begins
def main():
	if len(sys.argv) < 2 or len(sys.argv) > 3:
		print >>sys.stderr, "\nIncorrect number of arguments passed. Aborting..."
		help()
		sys.exit(1)
	
	repos_list = sys.argv[1]
	output_dir = sys.argv[2]

	if not os.path.isfile(repos_list):
		print >>sys.stderr, "\nRepository list doesn't exists at the path: ", repos_list
		help()
		sys.exit(1)

	if not os.path.isdir(output_dir):
		print >>sys.stderr, "\nOutput Directory doesn't exist at the path: ", output_dir
		help()
		sys.exit(1)

	check_env_var()
	run(repos_list, output_dir)


if __name__ == "__main__":
	main()
