#! /bin/bash
##### Java installation #####
echo "[vagrant provisioning] Installing Java..."]
apt-get update
apt-get -y install curl
apt-get -y install python-software-properties # adds add-apt-repository
add-apt-repository -y ppa:webupd8team/java
apt-get update

# automatic install of the Oracle JDK 7
echo oracle-java7-installer shared/accepted-oracle-license-v1-1 select true | sudo /usr/bin/debconf-set-selections

apt-get -y install oracle-java7-set-default

export JAVA_HOME="/usr/lib/jvm/java-7-oracle/jre"

echo "export JAVA_HOME=\$(readlink -f /usr/bin/java | sed \"s:bin/java::\")" >> /home/vagrant/.bashrc

##### Simple necessities #####
echo "[vagrant provisioning] Installing simple necessities..."
apt-get install -y vim
apt-get install -y git
apt-get install -y maven

##### Drat installation #####
echo "[vagrant provisioning] Installing drat..."
mkdir -p /usr/local/drat/deploy
mkdir -p /usr/local/drat/src
cd /usr/local/drat/src
git clone https://github.com/chrismattmann/drat.git .
mvn install
cp -R distribution/target/dms-distribution-0.1-bin.tar.gz ../deploy/
cd ../deploy/
tar xvzf dms-distribution-0.1-bin.tar.gz
rm *.tar.gz
chown -R vagrant /usr/local/drat
chgrp -R vagrant /usr/local/drat
export DRAT_HOME=/usr/local/drat/deploy
echo "export DRAT_HOME=/usr/local/drat/deploy" >> /home/vagrant/.bashrc

