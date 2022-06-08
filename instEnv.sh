#!/usr/bin/env bash

# Modify UserIntentions XML files
sed -i 's/.../.../g' *.xml

# Copy resources to S3 bucket
aws s3 cp ./resources/user_data s3://BUCKET/BUCKET_KEY/ --recursive
aws s3 cp ./resources/userintentions s3://BUCKET/BUCKET_KEY/ --recursive

# Instantiate Build Time Environment with CDK
## Some CDK commands here

# Create AMI's from Build Time Servers
./resources/scripts/ami_create.py

# Instantiate Run Time Environment with CDK
## Some CDK commands here
