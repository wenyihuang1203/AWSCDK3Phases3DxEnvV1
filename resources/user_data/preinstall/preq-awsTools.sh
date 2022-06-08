#!/usr/bin/env bash

# Establish arguments as variables
awsRegion=$1

# Install AWS SSM Agent
yum install -y https://s3.${awsRegion}.amazonaws.com/amazon-ssm-${awsRegion}/latest/linux_amd64/amazon-ssm-agent.rpm
# Alternate method using globally available package (viable but perhaps not best practice)
# yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_arm64/amazon-ssm-agent.rpm

# Install AWS CLI v2
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip"
unzip awscliv2.zip
./aws/install
