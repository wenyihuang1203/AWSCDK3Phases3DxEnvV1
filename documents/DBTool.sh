#!/usr/bin/env bash

sudo echo "DBTool.sh started" >>/tmp/DBTool.log
sudo curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/8/prod.repo
sudo yum remove unixODBC-utf16 unixODBC-utf16-devel
sudo ACCEPT_EULA=Y yum install -y msodbcsql17
sudo ACCEPT_EULA=Y yum install -y mssql-tools
echo "export PATH=$PATH:/opt/mssql-tools/bin" >>~/.bashrc
source ~/.bashrc
sudo yum install -y unixODBC-devel
sudo echo "DBTool.sh ended" >>/tmp/DBTool.log
