#!/usr/bin/env bash

sudo echo "threeDIndexInstall.sh started" >>/tmp/threeDIndexInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DIndexingServer-V6R2022x.Linux64.tar.gz /tmp/3DIndexingServer-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dindexingGA.xml /tmp/UserIntentions_3dindexingGA.xml
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
cd /tmp
tar xvfz 3DIndexingServer-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DIndexingServer-V6R2022x.Linux64.tar.gz
cd /tmp/3DIndexingServer.Linux64/1
sudo ./StartTUI.sh --silent /tmp/UserIntentions_3dindexingGA.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "threeDIndexInstall.sh ended" >>/tmp/threeDIndexInstall.log
