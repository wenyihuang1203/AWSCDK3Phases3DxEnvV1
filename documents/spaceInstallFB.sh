#!/usr/bin/env bash
sudo echo "spaceInstall.sh started" >> /tmp/spaceInstall.log
sudo mkdir /var/DassaultSystemes
sudo chmod 777 /var/DassaultSystemes
### Install space GA
sudo echo "Install Space GA" >> /tmp/spaceInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DSpace-V6R2022x.Linux64.tar.gz /tmp/3DSpace-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dspaceGA.xml /tmp/UserIntentions_3dspaceGA.xml
cd /tmp
sudo tar xvfz /tmp/3DSpace-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DSpace-V6R2022x.Linux64.tar.gz
sudo echo "before installing 3dspace platform" >> /tmp/spaceInstall.log
date >> /tmp/spaceInstall.log
sudo /tmp/3DSpace.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_3dspaceGA.xml
sudo rm -f -R /tmp/3DSpace.Linux64
sudo echo "after installing 3dspace platform" >> /tmp/spaceInstall.log
date >> /tmp/spaceInstall.log
### install 3DExplore GA
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/DS_Installer-V6R2022x.Linux64.tar.gz /tmp/DS_Installer-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Platform/3DExplore-V6R2022x.Linux64.tar.gz /tmp/3DExplore-V6R2022x.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dexploreGA.xml /tmp/UserIntentions_3dexploreGA.xml
cd /tmp
sudo tar xvfz /tmp/DS_Installer-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/DS_Installer-V6R2022x.Linux64.tar.gz
sudo tar xvfz /tmp/3DExplore-V6R2022x.Linux64.tar.gz
sudo rm -f /tmp/3DExplore-V6R2022x.Linux64.tar.gz
sudo /tmp/3DExplore.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_3dexploreGA.xml
sudo rm -f -R /tmp/3DExplore.Linux64

### install webapps GA
#######################################################################################
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/webApps2InstallList/webModulesSubList1.log /tmp/webModulesSubList1.log
sudo dos2unix /tmp/webModulesSubList1.log
while read -r line; do
    echo -e $line
    IFS='=' read -r -a array <<< $line
    echo ${array[0]}
    echo ${array[1]}
    aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/ga/Webapps/${array[0]} /tmp/${array[0]}
    aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/${array[1]} /tmp/${array[1]}
    cd /tmp
    sudo tar xvfz /tmp/${array[0]}
    sudo rm -f /tmp/${array[0]}
    IFS='-' read -r -a array1 <<< ${array[0]}
    sudo /tmp/${array1[0]}.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/${array[1]}
    sudo rm -f -R /tmp/${array1[0]}.Linux64
    #sudo rm -f /tmp/${array[1]}
    #sudo rm -f /tmp/*.sh
done < /tmp/webModulesSubList1.log
#########################################################################################

### Install Space FDD02
sudo echo "Install Space FD02" >> /tmp/spaceInstall.log
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Platform/3DSpace-V6R2022x.HF2.Linux64.tar.gz /tmp/3DSpace-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dspaceFD2.xml /tmp/UserIntentions_3dspaceFD2.xml
cd /tmp
sudo tar xvfz /tmp/3DSpace-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DSpace-V6R2022x.HF2.Linux64.tar.gz
sudo echo "before installing 3dspace platform FD02" >> /tmp/spaceInstall.log
date >> /tmp/spaceInstall.log
sudo /tmp/3DSpace.Linux64/1/StartTUI.sh --silent /tmp/UserIntentions_3dspaceFD2.xml
sudo rm -f -R /tmp/3DSpace.Linux64
sudo echo "after installing 3dspace platform FD02" >> /tmp/spaceInstall.log
date >> /tmp/spaceInstall.log

### Install 3DExplore FD02
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Webapps/DS_Installer-V6R2022x.HF2.Linux64.tar.gz /tmp/DS_Installer-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Webapps/3DExplore-V6R2022x.HF2.Linux64.tar.gz /tmp/3DExplore-V6R2022x.HF2.Linux64.tar.gz
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/UserIntentions_3dexploreFD2.xml /tmp/UserIntentions_3dexploreFD2.xml
cd /tmp
sudo tar xvfz /tmp/DS_Installer-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/DS_Installer-V6R2022x.HF2.Linux64.tar.gz
sudo tar xvfz /tmp/3DExplore-V6R2022x.HF2.Linux64.tar.gz
sudo rm -f /tmp/3DExplore-V6R2022x.HF2.Linux64.tar.gz
sudo /tmp/3DExplore.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/UserIntentions_3dexploreFD2.xml
sudo rm -f -R /tmp/3DExplore.Linux64

### Install webapps FD02
#######################################################################################
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/webApps2InstallList/webModulesListFD2.log /tmp/webModulesListFD2.log
sudo dos2unix /tmp/webModulesListFD2.log
while read -r line; do
    echo -e $line
    IFS='=' read -r -a array <<< $line
    echo ${array[0]}
    echo ${array[1]}
    aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/fd02/Webapps/${array[0]} /tmp/${array[0]}
    aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/UserIntentions/${array[1]} /tmp/${array[1]}
    cd /tmp
    sudo tar xvfz /tmp/${array[0]}
    sudo rm -f /tmp/${array[0]}
    IFS='-' read -r -a array1 <<< ${array[0]}
    sudo /tmp/${array1[0]}.Linux64/1/StartTUI.sh -installerPath /tmp/DS_Installer.Linux64/1 --silent /tmp/${array[1]}
    sudo rm -f -R /tmp/${array1[0]}.Linux64
done < /tmp/webModulesListFD2.log
#########################################################################################
### end of Install FD02

###
#sudo rm -f /tmp/*.sh
#sudo rm -f /tmp/*.xml
sudo chown -R webapp:webapp /appl/ds
sudo semanage port -a -t http_port_t -p tcp 9080
sudo semanage port -a -t http_port_t -p tcp 8070
sudo setsebool -P httpd_can_network_connect on
sudo systemctl restart httpd
sudo echo "spaceInstall.sh ended" >> /tmp/spaceInstall.log
