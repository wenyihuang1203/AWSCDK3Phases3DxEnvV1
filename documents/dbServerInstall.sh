#!/usr/bin/bash
sudo echo "dbServerInstall.sh started" >> /tmp/dbServerInstall.log
USERNAME=webapp
useradd -m -p sal/Jvl0B52ok ${USERNAME}
usermod -aG wheel ${USERNAME}
## make additional disk 1
mkfs -t ext4 /dev/nvme2n1
e2label /dev/nvme2n1 /db/system
sudo mkdir -p /db/system/
sudo echo "LABEL=/db/system /db/system ext4 defaults 1 2" >> /etc/fstab
mount /db/system
sudo chown -R ${USERNAME}:${USERNAME} /db/system
## make additional disk 2
sudo mkfs -t ext4 /dev/nvme4n1
e2label /dev/nvme4n1 /db/user
sudo mkdir -p /db/user
sudo echo "LABEL=/db/user /db/user ext4 defaults 1 2" >> /etc/fstab
sudo mount /db/user
sudo chown -R ${USERNAME}:${USERNAME} /db/user
## make additional disk 3
mkfs -t ext4 /dev/nvme3n1
e2label /dev/nvme3n1 /db/temp
sudo mkdir -p /db/temp
sudo echo "LABEL=/db/temp /db/temp ext4 defaults 1 2" >> /etc/fstab
sudo mount /db/temp
sudo chown -R ${USERNAME}:${USERNAME} /db/temp
## make additional disk 4
mkfs -t ext4 /dev/nvme1n1
e2label /dev/nvme1n1 /db/txlogs
sudo mkdir -p /db/txlogs
sudo echo "LABEL=/db/txlogs /txlogs ext4 defaults 1 2" >> /etc/fstab
mount /db/txlogs
sudo chown -R ${USERNAME}:${USERNAME} /db/txlogs
## install dbserver and dbtools and create 3DX databases
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/create22xdbs.sql /tmp/create22xdbs.sql
aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/orchdb.sql /tmp/orchdb.sql
export MSSQL_SA_PASSWORD=Sqlserver1
export MSSQL_PID=express
export SQL_ENABLE_AGENT=y
sudo curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/8/mssql-server-2019.repo
sudo curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/8/prod.repo
sudo yum install -y mssql-server
sudo systemctl stop mssql-server
MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD} MSSQL_PID=${MSSQL_PID} /opt/mssql/bin/mssql-conf -n setup accept-eula
sudo ACCEPT_EULA=Y yum install -y mssql-tools unixODBC-devel
sudo echo PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bash_profile
sudo echo export PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bashrc
source ~/.bashrc
sudo systemctl restart mssql-server
sudo chmod 777 /db/system 
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${MSSQL_SA_PASSWORD} -i /tmp/create22xdbs.sql -o /tmp/create22xdbs.log
/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${MSSQL_SA_PASSWORD} -i /tmp/orchdb.sql -o /tmp/orchdb.log
sudo echo "dbServerInstall.sh ended" >> /tmp/dbServerInstall.log

