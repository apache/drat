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
# author: mattmann


import sys
import os
import subprocess
import time
import shutil
import datetime
from urllib.request import urlopen, Request
import json
import xmlrpc

# Check for environment variables
def check_env_var():
	if os.getenv("DRAT_HOME") == None:
		print("Environment variable $DRAT_HOME is not set.")
		sys.exit(1)
	if os.getenv("JAVA_HOME") == None:
		print("Environment variable $JAVA_HOME is not set.")
		sys.exit(1)
	if os.getenv("SOLR_DRAT_URL") == None:
		print("Environment variable $SOLR_DRAT_URL is not set.")
		sys.exit(1)
	if os.getenv("WORKFLOW_URL") == None:
		print("Environment variable $WORKFLOW_URL is not set.")
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


# Count the number of files in a directory recursively
# Leverages a basic utility to exclude some files as well
def count_num_files(path, exclude):
	count = 0
	for root, dirs, files in os.walk(path):
		for filename in files:
			if exclude not in os.path.join(root, filename):
				count += 1
	return count


# Prints usage of this script
def help():
	print >>sys.stderr, "\n\nUsage: python dratstats.py <path to list of repository URLs> <path to output directory>\n"


# Printing out on Console
def printnow(string):
	print(string)
	sys.stdout.flush()


# Parsing RAT log files
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
		if command == "crawl":
			retcode = subprocess.call("${DRAT_HOME}/bin/drat" + " " + command + " --exclude \"\\.git\" " + repository, shell=True)
		elif command == "index":
			retcode = subprocess.call("${DRAT_HOME}/bin/drat" + " " + command + " " + repository, shell=True)
		elif command == "map" or command == "reduce":
			retcode = subprocess.call("${DRAT_HOME}/bin/drat" + " " + command + " &", shell=True)
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
	printnow ("Removing  " + os.getenv("DRAT_HOME") + "/data/workflow")
	shutil.rmtree(os.getenv("DRAT_HOME") + "/data/workflow")
	printnow ("Removing  " + os.getenv("DRAT_HOME") + "/filemgr/catalog")
	shutil.rmtree(os.getenv("DRAT_HOME") + "/filemgr/catalog")
	printnow ("Removing  " + os.getenv("DRAT_HOME") + "/solr/drat/data")
	shutil.rmtree(os.getenv("DRAT_HOME") + "/solr/drat/data")
	printnow ("Removing  " + os.getenv("DRAT_HOME") + "/data/archive")
	shutil.rmtree(os.getenv("DRAT_HOME") + "/data/archive")
	os.mkdir(os.getenv("DRAT_HOME") + "/data/archive")
	printnow ("Removing  " + os.getenv("DRAT_HOME") + "/data/jobs")
	shutil.rmtree(os.getenv("DRAT_HOME") + "/data/jobs")
	os.mkdir(os.getenv("DRAT_HOME") + "/data/jobs")


# Check if there are any pending PGE jobs in the queue
def job_in_queue(job_name):
	status = "PGE EXEC"
	server = xmlrpc.client.ServerProxy(os.getenv("WORKFLOW_URL"), verbose=False)
	

	for x in range(0,6):
		response = server.workflowmgr.getWorkflowInstancesByStatus(status)

		for i in range(0, len(response)):
		#print response[i]["sharedContext"]["TaskId"]
			if response[i]["sharedContext"]["TaskId"][0] == job_name:
				return True

		time.sleep(3)		

	

	return False


# Wait for job to complete
def wait_for_job(job_name):
	while job_in_queue(job_name):
		for i in range(1, 11):
			sys.stdout.write('.')
			sys.stdout.flush()
			time.sleep(2)


# Parse license from RAT
def parse_license(s):
	li_dict = {'N': 'Notes', 'B': 'Binaries', 'A': 'Archives', 'AL': 'Apache', '!?????': 'Unknown'}
	if s and not s.isspace():
		arr = s.split("/", 1)
		li = arr[0].strip()
		if li in li_dict:
			li = li_dict[li]
	
		if len(arr) > 1 and len(arr[1].split("/")) > 0:
			return [arr[1].split("/")[-1], li]
		else:
			printnow('split not correct during license parsing '+str(arr))
			return ["/dev/null", li_dict['!?????']]
	else:
		printnow('blank line provided to parse license ['+s+']')
		return ["/dev/null", li_dict['!?????']]


# Index into Solr
def index_solr(json_data):
	printnow(json_data)
	request = Request(os.getenv("SOLR_URL") + "/statistics/update/json?commit=true")
	request.add_header('Content-type', 'application/json')
	urlopen(request, json_data)


# Run DRAT and collect statistics
def run(repos_list, output_dir):
	repos = []
	
	with open(repos_list) as repositories:
		
		repo_content = repositories.readlines()
		# you may also want to remove whitespace characters like `\n` at the end of each line
		repo_content = [x.strip() for x in repo_content] 
		print('DRAT stats: inspecting '+str(len(repo_content))+' repositories.')
		
		for repository in repo_content:
			repo_toks = repository.split()
			repo_path = repo_toks[0]
			repo_name = repo_toks[1]
			repo_loc_url = repo_toks[2]
			repo_desc = ' '.join(repo_toks[3:])
			rep = {
				"id" : repo_loc_url,
				"repo": repo_path,
				"name" :repo_name,
				"loc_url" : repo_loc_url,
				"description": repo_desc,
				"type" : "project"				
				}
			
			if rep["repo"].startswith('#'):
				print('\nSkipping Repository: ' + rep["repo"][1:])
				continue
			print("\nVerifying repository path...\n")
			if not os.path.exists(rep["repo"]):
				print ("\nPath " + rep["repo"] + "is not valid. Skipping and moving on...\n")
				continue
			print("\nRepository Path: OK\n")
			repos.append(rep)

			print ("\nStarting OODT...\n")
			oodt_process("start")
			time.sleep(20)
			print("\nOODT Started: OK\n")

			print('Adding repository: '+str(rep)+' to Solr')
			# index_solr(json.dumps([rep]))


			print("\nRunning DRAT on " + rep["repo"] + " ...\n")
			
			retval = True
			stats = {}
			stats['id'] = rep["repo"]

			stats['crawl_start'] = current_datetime()
			retval = drat_process("crawl", rep["repo"])
			stats['crawl_end'] = current_datetime()

			rep["id"] = "id:"+os.path.normpath(rep["repo"])
			outputfile = os.getenv("DRAT_HOME") + "/data/repo"
			file = open(outputfile,"w")
			file.write(json.dumps(rep))
			file.close()

			if retval:
				time.sleep(5)
				stats['index_start'] = current_datetime()
				retval = drat_process("index", rep["repo"])
				stats['index_end'] = current_datetime()

				if retval:
					time.sleep(5)
					stats['map_start'] = current_datetime()
					retval = drat_process("map", None)
					time.sleep(10)
					wait_for_job("urn:drat:MimePartitioner")
					wait_for_job("urn:drat:RatCodeAudit")
					stats['map_end'] = current_datetime()

					if(retval):
						wait_for_job("urn:drat:RatAggregator")
						time.sleep(10)
						retval = drat_process("reduce",None)
                                                print ("\nwaiting for Rat Aggregator...\n")
                                                wait_for_job("urn:drat:RatAggregator")
			

			time.sleep(5)

                        if(retval):
                                # Copy Data with datetime variables above, extract output from RatAggregate file, extract data from Solr Core
                                printnow ("\nCopying data to Solr and Output Directory...\n")

                                # Copying data to Output Directory
                                repos_out = output_dir + "/" + normalize_path(rep["repo"])
                                shutil.copytree(os.getenv("DRAT_HOME") + "/data/archive", repos_out + "/data/archive")
                                shutil.copytree(os.getenv("DRAT_HOME") + "/data/jobs", repos_out + "/data/jobs")
                                shutil.copytree(os.getenv("DRAT_HOME") + "/data/workflow", repos_out + "/data/workflow")
                                print("\nData copied to Solr and Output Directory: OK\n")


                        time.sleep(5)
			print ("\nStopping OODT...\n")
			oodt_process("stop")
			time.sleep(20)
			print ("\nOODT Stopped: OK\n")

			print ("\nReseting DRAT...\n")
			drat_reset()
			time.sleep(5)
			print ("\nDRAT Reset: OK\n")

	print("\nDRAT SCAN COMPLETED!!!\n")


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
	
	dratData = os.getenv("DRAT_HOME") + "/data"
	if os.path.realpath(output_dir).startswith(dratData):
		print >>sys.stderr, "\nOutput dir cannot be a sub directory of "+dratData
		help()
		sys.exit(1)

	check_env_var()
	run(repos_list, output_dir)


if __name__ == "__main__":
	main()
