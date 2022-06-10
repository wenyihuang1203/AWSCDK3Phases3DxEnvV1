#!/usr/bin/env bash
sudo echo "fcsInstall.sh started" >> /tmp/fcsInstall.log
sudo echo "Install GA" >> /tmp/fcsInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes

### GA
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/FileCollaborationServer-V6R2022x.Linux64.tar.gz /tmp/FileCollaborationServer-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_fcsGA.xml /tmp/UserIntentions_fcsGA.xml
cd /tmp
sudo tar xvfz /tmp/FileCollaborationServer-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/FileCollaborationServer-V6R2022x.Linux64.tar.gz
sudo /tmp/FileCollaborationServer.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_fcsGA.xml
sudo rm -f -R /tmp/FileCollaborationServer.Linux64

### FD02
sudo echo "Install FD02" >> /tmp/fcsInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/FileCollaborationServer-V6R2022x.HF2.Linux64.tar.gz /tmp/FileCollaborationServer-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_fcsFD2.xml /tmp/UserIntentions_fcsFD2.xml
cd /tmp
sudo tar xvfz /tmp/FileCollaborationServer-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/FileCollaborationServer-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/FileCollaborationServer.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_fcsFD2.xml
sudo rm -f -R /tmp/FileCollaborationServer.Linux64

#### change owner
sudo rm -f /tmp/*.sh
sudo rm -f /tmp/*.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "fcsInstall.sh ended" >>/tmp/fcsInstall.log
