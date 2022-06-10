#!/usr/bin/env bash
sudo echo "notificationInstall.sh started" >> /tmp/notificationInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
### Install GA
sudo echo "Install GA" >> /tmp/notificationInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DNotification-V6R2022x.Linux64.tar.gz /tmp/3DNotification-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_notificationGA.xml /tmp/UserIntentions_notificationGA.xml
cd /tmp
sudo tar xvfz /tmp/3DNotification-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DNotification-V6R2022x.Linux64.tar.gz
sudo /tmp/3DNotification.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_notificationGA.xml
sudo rm -f -R /tmp/3DNotification.Linux64
### Install FD02
sudo echo "Install FD02" >> /tmp/notificationInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DNotification-V6R2022x.HF2.Linux64.tar.gz /tmp/3DNotification-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_notificationFD2.xml /tmp/UserIntentions_notificationFD2.xml
cd /tmp
sudo tar xvfz /tmp/3DNotification-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DNotification-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DNotification.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_notificationFD2.xml
sudo rm -f -R /tmp/3DNotification.Linux64

###
#sudo rm -f /tmp/*.xml
#sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8089
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo rm -f /tmp/3DNotification-V6R2022x.Linux64.tar.gz
sudo rm -f -R /tmp/3DNotification.Linux64
sudo echo "notificationInstall.sh ended" >>/tmp/notificationInstall.log
