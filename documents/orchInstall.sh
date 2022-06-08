#!/usr/bin/bash
sudo echo "orchInstall.sh started" >> /tmp/orchInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dorchGA.xml /tmp/UserIntentions_3dorchGA.xml
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
cd /tmp
sudo tar xvfz SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz
sudo tar xvfz SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz
sudo rm -f /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.1-2.tar.gz
sudo rm -f /tmp/SIMULIA_3DOrchestration-V6R2022x.Linux64.2-2.tar.gz
cd /tmp/SIMULIA_3DOrchestration.Linux64/1
sudo ./StartTUI.sh  --silent /tmp/UserIntentions_3dorchGA.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "orchInstall.sh ended" >> /tmp/orchInstall.log

