#!/usr/bin/env bash
sudo echo "ftsInstall.sh started" >> /tmp/ftsInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes

sudo echo "Install GA" >> /tmp/ftsInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DSpaceIndex-V6R2022x.Linux64.tar.gz /tmp/3DSpaceIndex-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_ftsGA.xml /tmp/UserIntentions_ftsGA.xml
cd /tmp
sudo tar xvfz /tmp/3DSpaceIndex-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DSpaceIndex-V6R2022x.Linux64.tar.gz
sudo /tmp/3DSpaceIndex.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_ftsGA.xml
sudo rm -f -R sudo /tmp/3DSpaceIndex.Linux64

### Install FD02
sudo echo "Install GAFD02" >> /tmp/ftsInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DSpaceIndex-V6R2022x.HF2.Linux64.tar.gz /tmp/3DSpaceIndex-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_ftsFD2.xml /tmp/UserIntentions_ftsFD2.xml
cd /tmp
sudo tar xvfz /tmp/3DSpaceIndex-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DSpaceIndex-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DSpaceIndex.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_ftsFD2.xml
sudo rm -f -R sudo /tmp/3DSpaceIndex.Linux64

###
sudo rm -f /tmp/*.xml
sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "ftsInstall.sh ended" >>/tmp/ftsInstall.log
