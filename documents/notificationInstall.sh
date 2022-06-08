#!/usr/bin/env bash

sudo echo "notificationInstall.sh started" >>/tmp/notificationInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DNotification-V6R2022x.Linux64.tar.gz /tmp/3DNotification-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_notificationGA.xml /tmp/UserIntentions_notificationGA.xml
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
cd /tmp
tar xvfz 3DNotification-V6R2022x.Linux64.tar.gz
cd /tmp/3DNotification.Linux64/1
sudo ./StartTUI.sh --silent /tmp/UserIntentions_notificationGA.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8089
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo rm -f /tmp/3DNotification-V6R2022x.Linux64.tar.gz
sudo rm -f -R /tmp/3DNotification.Linux64
sudo echo "notificationInstall.sh ended" >>/tmp/notificationInstall.log
