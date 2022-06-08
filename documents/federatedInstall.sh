#!/usr/bin/env bash

sudo echo "federatedInstall.sh started" >>/tmp/federatedInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/FederatedSearchFoundation-V6R2022x.Linux64.tar.gz /tmp/FederatedSearchFoundation-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_federatedGA.xml /tmp/UserIntentions_federatedGA.xml
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
cd /tmp
tar xvfz FederatedSearchFoundation-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/FederatedSearchFoundation-V6R2022x.Linux64.tar.gz
cd /tmp/FederatedSearchFoundation.Linux64/1
sudo ./StartTUI.sh --silent /tmp/UserIntentions_federatedGA.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "federatedInstall.sh ended" >>/tmp/federatedInstall.log
