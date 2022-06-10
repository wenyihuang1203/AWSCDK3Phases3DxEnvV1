#!/usr/bin/env bash
sudo echo "commentInstall.sh started" >> /tmp/commentInstall.log
### Install GA
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
sudo echo "Install Comment GA" >> /tmp/commentInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DComment-V6R2022x.Linux64.tar.gz /tmp/3DComment-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_commentGA.xml /tmp/UserIntentions_commentGA.xml
cd /tmp
tar xvfz /tmp/3DComment-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DComment-V6R2022x.Linux64.tar.gz
sudo /tmp/3DComment.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_commentGA.xml
sudo rm -f -R /tmp/3DComment.Linux64
##### end of GA

### Install FD02
sudo echo "Install Comment FD2" >> /tmp/commentInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DComment-V6R2022x.HF2.Linux64.tar.gz /tmp/Platform/3DComment-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_commentFD2.xml /tmp/UserIntentions_commentFD2.xml
cd /tmp
tar xvfz /tmp/Platform/3DComment-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/Platform/3DComment-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DComment.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_commentFD2.xml
sudo rm -f -R /tmp/3DComment.Linux64
### end of installing FD02

###
sudo rm -f /tmp/*.xml
sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo rm -f -R /tmp/3DComment.Linux64
sudo echo "commentInstall.sh ended" >>/tmp/commentInstall.log
