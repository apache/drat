import sys
import os
import json

def main(argv=None):
	if len(argv) == 0:
		print "No Repo details to dump"
		sys.exit()

	if os.getenv("DRAT_HOME")==None:
		print "Please add DRAT_HOME environment variable and try again";
		sys.exit()
	
	default_repo_file_url = os.getenv("DRAT_HOME") + "/conf/repo.default.txt"
	with open(default_repo_file_url,'rb')as repoFile:
		data = ''
		for line in repoFile:
			data+=line
	rep = eval(data)

	reponame = os.path.basename(os.path.normpath(argv[0]))

	rep["id"] = os.path.normpath(argv[0])
	rep["repo"] = os.path.normpath(argv[0])
	rep["name"] = reponame

	outputfile = os.getenv("DRAT_HOME") + "/data/repo"
	file = open(outputfile,"w")
	file.write(json.dumps(rep))
	file.close()

	print rep

if __name__ == "__main__":
	main(sys.argv[1:])
