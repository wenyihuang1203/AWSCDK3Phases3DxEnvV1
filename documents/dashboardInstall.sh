#!/usr/bin/env bash
sudo echo "dashboardInstall.sh started" >> /tmp/dashboardInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes

### install GA
echo "Install Dashboard GA" >> /tmp/dashboardInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DDashboard-V6R2022x.Linux64.tar.gz /tmp/3DDashboard-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_dashboardGA.xml /tmp/UserIntentions_dashboardGA.xml
cd /tmp
sudo tar xvfz /tmp/3DDashboard-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DDashboard-V6R2022x.Linux64.tar.gz
sudo /tmp/3DDashboard.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_dashboardGA.xml
sudo rm -f -R /tmp/3DDashboard.Linux64

### Install FD02
echo "Install Dashboard FD02" >> /tmp/dashboardInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DDashboard-V6R2022x.HF2.Linux64.tar.gz /tmp/3DDashboard-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_dashboardFD2.xml /tmp/UserIntentions_dashboardFD2.xml
cd /tmp
sudo tar xvfz /tmp/3DDashboard-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DDashboard-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DDashboard.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_dashboardFD2.xml
sudo rm -f -R /tmp/3DDashboard.Linux64

###
sudo rm -f /tmp/*.xml
sudo rm -f /tmp/*.sh
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 8080
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "dashboardInstall.sh ended" >>/tmp/dashboardInstall.log
