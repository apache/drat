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
export SOLR_DRAT_URL=http://localhost:8080/solr/drat
export DRAT_EXCLUDE=""

#####  Copy and Paste this Block into the .bashrc of your deployment user account ##########
#
# The following aliases must be used within a filemgr installation's
# bin directory since relative pathing is being used.  This block also
# assumes that the filemgr is running on port 9000 (the default port of filemgr)
#
alias fmquery="java -Dorg.apache.oodt.cas.filemgr.properties=$FILEMGR_HOME/etc/filemgr.properties -Djava.ext.dirs=.$FILEMGR_HOME/lib org.apache.oodt.cas.filemgr.tools.QueryTool --url $FILEMGR_URL --lucene -query "
#
alias fmdel="java -Dorg.apache.oodt.cas.filemgr.properties=$FILEMGR_HOME/etc/filemgr.properties -Djava.ext.dirs=$FILEMGR_URL/lib org.apache.oodt.cas.filemgr.tools.DeleteProduct --fileManagerUrl $FILEMGR_URL --read"
#
alias metdump="java -Djava.ext.dirs=$FILEMGR_HOME/lib org.apache.oodt.cas.filemgr.tools.MetadataDumper --url $FILEMGR_URL --out . --productId "
#
######## END OF BLOCK #######
