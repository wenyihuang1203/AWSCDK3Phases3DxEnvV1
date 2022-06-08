#!/usr/bin/env bash

sudo echo "commonPackages.sh started" >>/tmp/commonPackages.log
sudo yum install lsb -y
sudo yum install git -y
sudo yum install wget -y
sudo yum install lsof -y
sudo yum install telnet -y
sudo yum install net-tools -y
sudo yum install httpd -y
sudo yum install mod_ssl -y
sudo yum install nfs-utils -y
sudo systemctl restart httpd
sudo systemctl enable httpd
sudo yum install sed zip unzip curl -y
sudo yum install ksh -y
sudo yum install compat-openssl10 -y
sudo yum install dejavu-sans-fonts -y
sudo yum install gd -y
sudo yum install pcre-utf16 -y
sudo yum install unixODBC -y
sudo yum install xorg-x11-xauth -y
sudo yum install python2 -y
sudo yum install python3 -y
sudo yum install policycoreutils-python-utils -y
sudo echo "commonPackages.sh ended" >>/tmp/commonPackages.log
