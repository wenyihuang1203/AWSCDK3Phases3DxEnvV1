#!/usr/bin/env bash

# Variables to modify when new versions are released
JAVA_VERSION=11.0.14.1_1_openj9-0.30.1
JAVA_SHORT_VERSION=11.0.14.1+1
TOMEE_VERSION=8.0.6

# Remove KSH dependancy (used by DS installers)
## Force Bash instead of ksh
alternatives --install /bin/ksh ksh /usr/bin/bash 1
## lsb-core creates alterative for print to lpr.cups, need to remove it
alternatives --remove-all print
alternatives --install /bin/print print /usr/bin/echo 1

# Add Java Semeru 11 with OpenJ9 (need to deal with bucket name)
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/Java/ibm-semeru-open-jdk_x64_linux_${JAVA_VERSION}.tar.gz /appl/java/
cd /appl/java
tar -xvf ./ibm-semeru-open-jdk_x64_linux_${JAVA_VERSION}.tar.gz
ln -s /appl/java/jdk-${JAVA_SHORT_VERSION} /appl/java/jdk
rm -f ./ibm-semeru-open-jdk_x64_linux_${JAVA_VERSION}.tar.gz
chown -R admin:admin /appl/java

# Add TomEE Plus 8 (need to deal with bucket name)
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/TomeePlus/apache-tomee-${TOMEE_VERSION}-plus.tar.gz /appl/tomee/
cd /appl/tomee
sudo tar -xvf ./apache-tomee-${TOMEE_VERSION}-plus.tar.gz
mv apache-tomee-plus-${TOMEE_VERSION} jvm
rm -f ./apache-tomee-${TOMEE_VERSION}-plus.tar.gz
chown -R admin:admin /appl/tomee

# Add MSSQL components
curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/8/prod.repo
ACCEPT_EULA=Y yum install -y msodbcsql17
