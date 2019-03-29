From ubuntu:bionic

COPY distribution/target/dms-distribution-0.1-bin.tar.gz /

ENV JAVA_HOME=/usr/lib/jvm/java-8-openjdk-amd64/
ENV DRAT_HOME=/root/drat/deploy
ENV GANGLIA_URL=http://zipper.jpl.nasa.gov/ganglia/
ENV FILEMGR_URL=http://localhost:9000
ENV WORKFLOW_URL=http://localhost:9001
ENV RESMGR_URL=http://localhost:9002
ENV WORKFLOW_HOME=$DRAT_HOME/workflow
ENV FILEMGR_HOME=$DRAT_HOME/filemgr
ENV PGE_ROOT=$DRAT_HOME/pge
ENV PCS_HOME=$DRAT_HOME/pcs
ENV FMPROD_HOME=$DRAT_HOME/tomcat/webapps/fmprod/WEB-INF/classes/
ENV PATH=$JAVA_HOME/bin:$PATH
ENV SOLR_DRAT_URL=http://localhost:8080/solr/drat
ENV DRAT_EXCLUDE=""

RUN apt update && apt install -y python3 python3-pip openjdk-8-jdk && pip3 install requests && mkdir -p /root/drat/deploy && tar xvfz dms-distribution-0.1-bin.tar.gz -C /root/drat/deploy/ \
&& echo 'alias fmquery="java -Dorg.apache.oodt.cas.filemgr.properties=$FILEMGR_HOME/etc/filemgr.properties -Djava.ext.dirs=.$FILEMGR_HOME/lib org.apache.oodt.cas.filemgr.tools.QueryTool --url $FILEMGR_URL --lucene -query "' >> /root/.bashrc \
&& echo 'alias fmdel="java -Dorg.apache.oodt.cas.filemgr.properties=$FILEMGR_HOME/etc/filemgr.properties -Djava.ext.dirs=$FILEMGR_URL/lib org.apache.oodt.cas.filemgr.tools.DeleteProduct --fileManagerUrl $FILEMGR_URL --read"' >> /root/.bashrc \
&& echo 'alias metdump="java -Djava.ext.dirs=$FILEMGR_HOME/lib org.apache.oodt.cas.filemgr.tools.MetadataDumper --url $FILEMGR_URL --out . --productId "' >> /root/.bashrc


CMD /root/drat/deploy/bin/oodt start && tail -f /root/drat/deploy/logs/oodt.out
