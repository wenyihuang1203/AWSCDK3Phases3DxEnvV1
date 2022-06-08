#!/usr/bin/env bash

echo "JavaTomeeFileSystem.sh started" >>/tmp/JavaTomeeFileSystem.log
## user and file system
sudo useradd -m -p sal/Jvl0B52ok webapp
sudo usermod -aG wheel webapp
sudo mkfs -t ext4 /dev/nvme1n1
sudo e2label /dev/nvme1n1 /appl
sudo mkdir /appl
sudo echo "LABEL=/appl /appl ext4 defaults 1 2" >>/etc/fstab
sudo mount /appl
## tomee and java
sudo mkdir /appl/java
sudo mkdir /appl/tomeePlus
sudo chown -R webapp:webapp /appl
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/Java/ibm-semeru-open-jdk_x64_linux_11.0.14.1_1_openj9-0.30.1.tar.gz /appl/java/ibm-semeru-open-jdk_x64_linux_11.0.14.1_1_openj9-0.30.1.tar.gz
cd /appl/java
sudo tar -xvf ./ibm-semeru-open-jdk_x64_linux_11.0.14.1_1_openj9-0.30.1.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/TomeePlus/apache-tomee-8.0.6-plus.tar.gz /appl/tomeePlus/apache-tomee-8.0.6-plus.tar.gz
cd /appl/tomeePlus
sudo tar -xvf ./apache-tomee-8.0.6-plus.tar.gz
echo "JavaTomeeFileSystem.sh ended" >>/tmp/JavaTomeeFileSystem.log
