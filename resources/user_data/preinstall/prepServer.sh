#!/usr/bin/env bash

# Create DS service user
## Used "admin" and UID/GID:1001 to match the P1 reqs for containers
groupadd admin -g 1001
useradd -m admin -u 1001 -g 1001

# Create filesystem for /appl (this works but is not completely foolproof)
mkfs -t xfs /dev/nvme1n1
e2label /dev/nvme1n1 /appl
mkdir /appl
echo "LABEL=/appl /appl xfs defaults,nofail 0 2" >> /etc/fstab
mount /appl

# Create general directory structure
mkdir -p /appl/{ds,java,tomee}

# Set ownership for /appl to DS user
chown -R admin:admin /appl

# Create folder to put DSLicSrv.txt file
mkdir -p /var/DassaultSystemes/Licenses
touch /var/DassaultSystemes/Licenses/DSLicSrv.txt
chown -R admin:admin /var/DassaultSystemes