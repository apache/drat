########  setenv.sh ########
#
# Set project specific configuration in setenv.sh
#
# Example:
# 		- Change filemgr URL to http://locatlhost:1234
#			FILEMGR_URL=http://locatlhost:1234
#
#		- Set custom job directory
#			PROJECT_JOB_DIR=/usr/local/project/data/jobs
#
############################

export DRAT_HOME=$HOME/drat/deploy
export FILEMGR_URL=http://localhost:9000
export WORKFLOW_URL=http://localhost:9001
export RESMGR_URL=http://localhost:9002
export FILEMGR_HOME=$DRAT_HOME/filemgr
export PGE_HOME=$DRAT_HOME/pge
export PCS_HOME=$DRAT_HOME/pcs
export OPSUI_URL=http://localhost:8080/opsui
export SOLR_URL=http://localhost:8080/solr
export FMPROD_HOME=$DRAT_HOME/tomcat/webapps/fmprod/WEB-INF/classes/
