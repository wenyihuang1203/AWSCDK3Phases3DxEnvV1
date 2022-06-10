#!/usr/bin/env bash
sudo echo "swymInstall.sh started" >> /tmp/swymInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes


### Install GA
sudo echo "Install GA" >> /tmp/swymInstall.log
### Cloud View
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/EXALEAD_CloudView-V6R2022x.Linux64.tar.gz /tmp/EXALEAD_CloudView-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_cloudviewGA.xml /tmp/UserIntentions_cloudviewGA.xml
cd /tmp
sudo tar xvfz /tmp/EXALEAD_CloudView-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/EXALEAD_CloudView-V6R2022x.Linux64.tar.gz
sudo /tmp/EXALEAD_CloudView.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_cloudviewGA.xml
sudo rm -f -R /tmp/EXALEAD_CloudView.Linux64
### Swym
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DSwym-V6R2022x.Linux64.tar.gz /tmp/3DSwym-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_swymGA.xml /tmp/UserIntentions_swymGA.xml
cvurl=$(hostname)
sudo sed -i "s/__cloudviewurl__/$cvurl/g" /tmp/UserIntentions_swymGA.xml
sudo tar xvfz /tmp/3DSwym-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DSwym-V6R2022x.Linux64.tar.gz
sudo /tmp/3DSwym.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_swymGA.xml
sudo rm -f -R /tmp/3DSwym.Linux64

### Install FD02
sudo echo "Install FD02" >> /tmp/swymInstall.log
### Cloud View
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/EXALEAD_CloudView-V6R2022x.HF2.Linux64.tar.gz /tmp/EXALEAD_CloudView-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_cloudviewFD2.xml /tmp/UserIntentions_cloudviewFD2.xml
cd /tmp
sudo tar xvfz /tmp/EXALEAD_CloudView-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/EXALEAD_CloudView-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/EXALEAD_CloudView.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_cloudviewFD2.xml
sudo rm -f -R /tmp/EXALEAD_CloudView.Linux64
### Swym
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DSwym-V6R2022x.HF2.Linux64.tar.gz /tmp/3DSwym-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_swymFD2.xml /tmp/UserIntentions_swymFD2.xml
cvurl=$(hostname)
sudo sed -i "s/__cloudviewurl__/$cvurl/g" /tmp/UserIntentions_swymFD2.xml
sudo tar xvfz /tmp/3DSwym-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DSwym-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DSwym.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_swymFD2.xml
sudo rm -f -R /tmp/3DSwym.Linux64

###
sudo rm -f /tmp/*.xml
sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo semanage port -a -t http_port_t -p tcp 29000
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo rm -f -R /tmp/3DSwym.Linux64
sudo rm -f -R /tmp/EXALEAD_CloudView.Linux64
sudo echo "swymInstall.sh ended" >>/tmp/swymInstall.log
