#!/usr/bin/env bash

sudo echo "orchInstall.sh started" >> /tmp/orchInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes

### Install GA
sudo echo "Install GA" >> /tmp/orchInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dorchGA.xml /tmp/UserIntentions_3dorchGA.xml
cd /tmp
sudo tar xvfz /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz
sudo tar xvfz /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz
sudo rm -f /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz
sudo rm -f /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz
sudo /tmp/SIMULIA_3DOrchestration.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_3dorchGA.xml
sudo rm -f -R /tmp/SIMULIA_3DOrchestration.Linux64

### Install FD02
sudo echo "Install FD02" >> /tmp/orchInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/SIMULIA_3DOrchestration.HF2.Linux64.tar.gz /tmp/SIMULIA_3DOrchestration.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dorchFD2.xml /tmp/UserIntentions_3dorchFD2.xml
cd /tmp
sudo tar xvfz /tmp/SIMULIA_3DOrchestration.HF2.Linux64.tar.gz
sudo rm -f /tmp/SIMULIA_3DOrchestration.HF2.Linux64.tar.gz
sudo /tmp/SIMULIA_3DOrchestration.HF2.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_3dorchFD2.xml
sudo rm -f -R /tmp/SIMULIA_3DOrchestration.HF2.Linux64

###
sudo rm -f /tmp/*.xml
sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "orchInstall.sh ended" >>/tmp/orchInstall.log
