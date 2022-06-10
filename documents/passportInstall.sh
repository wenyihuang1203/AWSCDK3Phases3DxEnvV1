#!/usr/bin/env bash
sudo echo "passportInstall.sh started" >> /tmp/passportInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
### Install GA
sudo echo "Install Passport GA" >> /tmp/passportInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DPassport-V6R2022x.Linux64.tar.gz /tmp/3DPassport-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_passportGA.xml /tmp/UserIntentions_passportGA.xml
cd /tmp
sudo tar xvfz /tmp/3DPassport-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DPassport-V6R2022x.Linux64.tar.gz
sudo /tmp/3DPassport.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_passportGA.xml
sudo rm -f -R /tmp/3DPassport.Linux64

### Install FD02
sudo echo "Install Passport FD02" >> /tmp/passportInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DPassport-V6R2022x.HF2.Linux64.tar.gz /tmp/3DPassport-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_passportFD2.xml /tmp/UserIntentions_passportFD2.xml
cd /tmp
tar xvfz /tmp/3DPassport-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DPassport-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DPassport.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_passportFD2.xml
sudo rm -f -R /tmp/3DPassport.Linux64

###
sudo rm -f /tmp/*.xml
sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "passportInstall.sh ended" >>/tmp/passportInstall.log
