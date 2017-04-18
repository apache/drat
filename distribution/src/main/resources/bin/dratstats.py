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
import getopt
import glob

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
	print string
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
			retcode = subprocess.call("nohup ${DRAT_HOME}/bin/drat" + " " + command + " &", shell=True)
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


# Parse license from RAT
def parse_license(s):
	li_dict = {'N': 'Notes', 'B': 'Binaries', 'A': 'Archives', 'AL': 'Apache', '!?????': 'Unknown'}
	arr = s.split("/", 1)
	li = arr[0].strip()
	if li in li_dict:
		li = li_dict[li]
	return [arr[1].split("/")[-1].strip().replace("_|_", "/"), li]


# Index into Solr
def index_solr(json_data):
	printnow(json_data)
	request = urllib2.Request(os.getenv("SOLR_URL") + "/statistics/update/json?commit=true")
	request.add_header('Content-type', 'application/json')
	urllib2.urlopen(request, json_data)


# Run DRAT and collect statistics
def run(repos_list, output_dir):
	with open(repos_list) as repositories:
		for repository in repositories:
			repository = repository.strip()
			printnow ("\nVerifying repository path...\n")
			if not os.path.exists(repository):
				printnow ("\nPath " + repository + "is not valid. Skipping and moving on...\n")
				continue
			printnow ("\nRepository Path: OK\n")

			printnow ("\nStarting OODT...\n")
			oodt_process("start")
			time.sleep(20)
			printnow ("\nOODT Started: OK\n")

			printnow ("\nRunning DRAT on " + repository + " ...\n")
			
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
					time.sleep(10)
					wait_for_job("urn:drat:MimePartitioner")
					wait_for_job("urn:drat:RatCodeAudit")
					stats['map_end'] = current_datetime()

					if retval:
						time.sleep(5)
						stats['reduce_start'] = current_datetime()
						
						# Extract data from RatAggregate File
						totalNotes = 0
						totalBinaries = 0
						totalArchives = 0
						totalStandards = 0
						totalApache = 0
						totalGenerated = 0
						totalUnknown = 0

						rat_dir = os.getenv("DRAT_HOME") + "/data/archive/rat"

						# Iterate over all RAT log files 
						for root, dirs, files in os.walk(rat_dir):
							for filename in files:
								if filename.endswith(".log"):
									(notes, binaries, archives,standards,apachelicensed,generated,unknown) = parseFile(os.path.join(root, filename))
									totalNotes = totalNotes + notes
									totalBinaries = totalBinaries + binaries
									totalArchives = totalArchives + archives
									totalStandards = totalStandards + standards
									totalApache = totalApache + apachelicensed
									totalGenerated = totalGenerated + generated
									totalUnknown = totalUnknown + unknown

						stats["license_Notes"] = totalNotes
						stats["license_Binaries"] = totalBinaries
						stats["license_Archives"] = totalArchives
						stats["license_Standards"] = totalStandards
						stats["license_Apache"] = totalApache
						stats["license_Generated"] = totalGenerated
						stats["license_Unknown"] = totalUnknown

						stats['reduce_end'] = current_datetime()
						print "\nDRAT Scan Completed: OK\n"

			time.sleep(5)

			if retval:
				# Copy Data with datetime variables above, extract output from RatAggregate file, extract data from Solr Core
				printnow ("\nCopying data to Solr and Output Directory...\n")

				# Extract data from Solr
				neg_mimetype = ["image", "application", "text", "video", "audio", "message", "multipart"]
				connection = urllib2.urlopen(os.getenv("SOLR_URL") + "/drat/select?q=*%3A*&rows=0&facet=true&facet.field=mimetype&wt=python&indent=true")
				response = eval(connection.read())
				mime_count = response["facet_counts"]["facet_fields"]["mimetype"]

				for i in range(0, len(mime_count), 2):
					if mime_count[i].split("/")[0] not in neg_mimetype:
						stats["mime_" + mime_count[i]] = mime_count[i + 1]


				# Count the number of files
				stats["files"] = count_num_files(repository, ".git")

				# Write data into Solr
				stats["type"] = 'software'
				stats_data = []
				stats_data.append(stats)
				json_data = json.dumps(stats_data)
				index_solr(json_data)

				# Parse RAT logs
				rat_logs_dir = os.getenv("DRAT_HOME") + "/data/archive/rat/*/*.log"
				rat_license = {}
				rat_header = {}
				for filename in glob.glob(rat_logs_dir):
					#print('=' * 20)
					section = 0
					l = 0
					h = 0
					cur_file = ''
					cur_header = ''
					cur_section = ''
					with open(filename, 'rb') as f:
						for line in f:
							if '*****************************************************' in line:
								cur_section = ''
							if line.startswith('  Files with Apache'):
								cur_section = 'licenses'
							if line.startswith(' Printing headers for '):
								cur_section = 'headers'
							if cur_section == 'licenses':
								l += 1
								if l > 4:
									line = line.strip()
									if line:
										li = parse_license(line)
										rat_license[li[0]] = li[1]
									# print(li)
							if cur_section == 'headers':
								if '=====================================================' in line or '== File:' in line:
									h += 1
								if h == 2:
									cur_file = line.split("/")[-1].strip().replace("_|_", "/")
								if h == 3:
									cur_header += line
								if h == 4:
									rat_header[cur_file] = cur_header.split("\n", 1)[1]
									cur_file = ''
									cur_header = ''
									h = 1
					if h == 3:
						rat_header[cur_file] = cur_header.split("\n", 1)[1]

				# Index RAT logs into Solr
				connection = urllib2.urlopen(os.getenv("SOLR_URL") +
											 "/drat/select?q=*%3A*&fl=filename%2Cfilelocation%2Cmimetype&wt=python&rows="
											 + str(stats["files"]) +"&indent=true")
				response = eval(connection.read())
				docs = response['response']['docs']
				file_data = []
				batch = 100
				dc = 0
				for doc in docs:
					fdata = {}
					fdata['id'] = os.path.join(doc['filelocation'][0], doc['filename'][0])
					fdata["type"] = 'file'
					fdata['parent'] = repository
					fdata['mimetype'] = doc['mimetype'][0]
					fdata['license'] = rat_license[fdata['id']]
					if fdata['id'] in rat_header:
						fdata['header'] = rat_header[fdata['id']]
					file_data.append(fdata)
					dc += 1
					if dc % batch == 0:
						json_data = json.dumps(file_data)
						index_solr(json_data)
						file_data = []
				if dc % batch != 0:
					json_data = json.dumps(file_data)
					index_solr(json_data)

				# Copying data to Output Directory
				repos_out = output_dir + "/" + normalize_path(repository)
				shutil.copytree(os.getenv("DRAT_HOME") + "/data", repos_out)
				printnow ("\nData copied to Solr and Output Directory: OK\n")

			else:
				printnow ("\nDRAT Scan Completed: Resulted in Error\n")


			time.sleep(5)
			printnow ("\nStopping OODT...\n")
			oodt_process("stop")
			time.sleep(20)
			printnow ("\nOODT Stopped: OK\n")

			printnow ("\nReseting DRAT...\n")
			drat_reset()
			time.sleep(5)
			printnow ("\nDRAT Reset: OK\n")

	printnow ("\nDRAT SCAN COMPLETED!!!\n")


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
