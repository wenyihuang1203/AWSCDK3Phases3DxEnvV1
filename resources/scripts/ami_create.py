#!/usr/bin/env python3

# Create AMI from Tags
## Purpose:  

### Revision:   1.0
### Date:       07.JUN.22
### Author:     J. Hines
### Notes:      Script creation

import boto3

c1_session = boto3.session.Session(profile_name="cdkuser")

ec2 = c1_session.resource("ec2", region_name="us-west-2")

image_ids = []

instances = ec2.instances.filter(
    Filters=[
        {"Name": "instance-state-name", "Values": ["running"]},
        {
            "Name": "tag:Service",
            "Values": ["Pass", "Dash", "Space", "Search", "Comment", "Notif"],
        },
        {"Name": "tag:Stage", "Values": ["Build"]},
    ]
)

for instance in instances:
    print(instance.id, instance.placement)
    image = instance.create_image(Name="AMI Copy For " + instance.id)
    print(image)
    image_ids.append(image.id)

ec2_client = boto3.client('ec2', region_name='us-west-2')

waiter = ec2_client.get_waiter('image_available')

waiter.wait(Filters=[{
 'Name': 'image-id',
 'Values': image_ids
}])

