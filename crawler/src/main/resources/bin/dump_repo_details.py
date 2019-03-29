#!/usr/bin/env python
#
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

import sys
import os
import json

def main(argv=None):
	if len(argv) == 0:
		print("No Repo details to dump")
		sys.exit()

	if os.getenv("DRAT_HOME")==None:
		print("Please add DRAT_HOME environment variable and try again");
		sys.exit()
	
	default_repo_file_url = os.getenv("DRAT_HOME") + "/conf/repo.default.txt"
	with open(default_repo_file_url,'rb')as repoFile:
		data = ''
		for line in repoFile:
			data+=line.strip().decode('utf-8')
	rep = eval(data)

	reponame = os.path.basename(os.path.normpath(argv[0]))
	rep["id"] = "id:"+os.path.normpath(argv[0])
	rep["repo"] = os.path.normpath(argv[0])
	rep["name"] = reponame

	outputfile = os.getenv("DRAT_HOME") + "/data/repo"
	file = open(outputfile,"w")
	file.write(json.dumps(rep))
	file.close()

	print(rep)

if __name__ == "__main__":
	main(sys.argv[1:])
