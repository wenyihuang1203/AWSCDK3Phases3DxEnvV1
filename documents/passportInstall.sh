#!/usr/bin/env bash

sudo echo "passportInstall.sh started" >>/tmp/passportInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DPassport-V6R2022x.Linux64.tar.gz /tmp/3DPassport-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_passportGA.xml /tmp/UserIntentions_passportGA.xml
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
cd /tmp
tar xvfz 3DPassport-V6R2022x.Linux64.tar.gz
cd /tmp/3DPassport.Linux64/1
sudo ./StartTUI.sh --silent /tmp/UserIntentions_passportGA.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "passportInstall.sh ended" >>/tmp/passportInstall.log
