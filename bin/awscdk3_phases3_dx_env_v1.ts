#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { SAOCgetVPC } from '../lib/SAOCgetVPC';
import { SaocDatabaseStack } from '../lib/SaocDatabaseStack';
import { SAOCcreateSecurityGroup } from '../lib/SAOCcreateSecurityGroup';
import { SaocSpaceStack } from '../lib/SaocSpaceStack';
import { SaocPassportStack } from '../lib/SaocPassportStack';
import { SaocDashboardStack } from '../lib/SaocDashboardStack';
import { SaocCommentStack } from '../lib/SaocCommentStack';
import { SaocNotificationStack } from '../lib/SaocNotificationStack';
import { SaocFederatedStack } from '../lib/SaocFederatedStack';
import { SaocFcsStack } from '../lib/SaocFcsStack';
import { SaocFtsStack } from '../lib/SaocFtsStack';
import { Saoc3DIndexStack } from '../lib/Saoc3DIndexStack';
import { SaocSwymStack } from '../lib/SaocSwymStack';
import { SaocNfsStack } from '../lib/SaocNfsStack';
import { SaocBastionStack } from '../lib/SaocBastionStack';
import { SaocOrchStack } from '../lib/SaocOrchStack';
import { SaocUserdatasStack } from '../lib/SaocUserdatasStack';
import { RHEL8LaunchASGAppServer } from '../lib/RHEL8LaunchASGAppServer';
import { RHEL8LaunchEc2DbServer } from '../lib/RHEL8LaunchEc2DbServer';


//================================================//
//=== variables for SAOCcreateSecurityGroup.ts ===//
//================================================//
const name4CreateSG = 'SAOCcreateSecurityGroups'
const prefix = 'SG-SAOC'
const sg1Name = 'sgExternalToBastion'
const sg2Name = 'sgBastionToInternal'
const sg3Name = 'sgPlatformToDBServer'
const sg4Name = 'sgPlatformToFileServer'
const sg5Name = 'sgSpaceToSpaceIndexServer'
const sg6Name = 'sgSwymToSwymIndexServer'
const sg1Title = 'SG-001'
const sg2Title = 'SG-002'
const sg3Title = 'SG-003'
const sg4Title = 'SG-004'
const sg5Title = 'SG-005'
const sg6Title = 'SG-006'
//===============================================================================================//
//===       SECTION ONE: create EC2 Instances and install software on the ec2 Instances       ===//
//===                       Line 43 to Line 436                                               ===//
//===============================================================================================//
//================================================//
//=== the next line creates a CDK Application  ===//
//=== the app is passed to all stacks call     ===//
//================================================//
const app = new cdk.App();
/***
const userdataStackProp = {
  env:{account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION},
}
const UserdatasInstance = new SaocUserdatasStack(app, "SaocUserdatasStack", userdataStackProp)
const userdataOrch = UserdatasInstance.userdata1
***/

//==============================================================//
//=== call stack SAOCgetVPC stack to get the pre-created VPC ===//
//==============================================================//
const myVpcName = 'VPC-SAOC'
const Name4GetVPCStack = 'getVpcSaoc'

const myVpcStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  myVpcName: myVpcName,
  stackName: Name4GetVPCStack
}
const vpcStack = new SAOCgetVPC(app, Name4GetVPCStack, myVpcStackProps);
const vpc = vpcStack.vpc;

//=========================================//
//=== stack 2: create 6 security groups ===//
//=========================================//
const mySGStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  prefix: prefix,
  sg1Name: sg1Name,
  sg2Name: sg2Name,
  sg3Name: sg3Name,
  sg4Name: sg4Name,
  sg5Name: sg5Name,
  sg6Name: sg6Name,
  sg1Title: sg1Title,
  sg2Title: sg2Title,
  sg3Title: sg3Title,
  sg4Title: sg4Title,
  sg5Title: sg5Title,
  sg6Title: sg6Title,
}
const sgStack = new SAOCcreateSecurityGroup(app, name4CreateSG, mySGStackProps);

//============================================================================//
//=== global variable mySG001, mySG002, mySG003, mySG004, mySG005, mySG006 ===//
//============================================================================//
const mySG001 = sgStack.bastionServerSG
const mySG002 = sgStack.appServerSG
const mySG003 = sgStack.dbServerSG
const mySG004 = sgStack.fileServerSG
const mySG005 = sgStack.spaceIndexServerSG
const mySG006 = sgStack.swymIndexServerSG

//=============================//
//=== Define instance Types ===//
//=============================//
const instanceTypeC5Large = ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE)
const instanceTypeM5Large = ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.LARGE)
const instanceTypeM5ZN2XL = ec2.InstanceType.of(ec2.InstanceClass.M5ZN, ec2.InstanceSize.XLARGE2)
const instanceTypeM5ZNXL = ec2.InstanceType.of(ec2.InstanceClass.M5ZN, ec2.InstanceSize.XLARGE)
const instanceTypeR5B2XL = ec2.InstanceType.of(ec2.InstanceClass.R5B, ec2.InstanceSize.XLARGE2)
const instanceTypeM5XLarge = ec2.InstanceType.of(ec2.InstanceClass.M5, ec2.InstanceSize.XLARGE)

//=============================//
//=== Define originsl AMI   ===//
//=============================//
const Redhat8AMI = ec2.MachineImage.genericLinux({ 'us-west-2': 'ami-0b28dfc7adc325ef4' })

//=============================================//
//=== Define EBS device Volume type for EC2 ===//
//=============================================//
const gp2Type = ec2.EbsDeviceVolumeType.GP2
const gp3Type = ec2.EbsDeviceVolumeType.GP3
const io2Type = ec2.EbsDeviceVolumeType.IO2

//=========================================//
//=== stack to create DB Server         ===//
//=========================================//
const SaocDBStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG003,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  privateIpAddress: '10.4.12.10',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Database-AWP3DX',
  TagName: 'Database-AWP3DX',
  TagType: 'Database-AWP3DX',
  volumeSize: 30,
  volumeSize2: 30,
  volumeSize3: 30,
  volumeSize4: 30,
}
const SaocDBInstance = new SaocDatabaseStack(app, 'SaocDatabase-AWP3DX', SaocDBStackProps);

//=================================================//
//=== stack for Bastion creation             ===//
//=================================================//
const SaocBastionStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG001,
  subnetGroupName: 'Public',
  subnetID: 'subnet-0c8c9b80924a0e0c0',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Bastion-AWP3DX',
  TagName: 'Bastion-AWP3DX',
  TagType: 'Bastion-AWP3DX',
  volumeSize: 50,
}
const SaocBastionInstance = new SaocBastionStack(app, 'SaocBastion-AWP3DX', SaocBastionStackProps);

//=================================================//
//=== stack for 3dpassport creation             ===//
//=================================================//
const SaocPassportStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Passport-AWP3DX',
  TagName: 'Passport-AWP3DX',
  TagType: 'Passport-AWP3DX',
  volumeSize: 50,
}
const SaocPassportInstance = new SaocPassportStack(app, 'SaocPassport-AWP3DX', SaocPassportStackProps);

//=================================================//
//=== stack for 3ddashboard creation            ===//
//=================================================//
const SaocDashboardStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Dashboard-AWP3DX',
  TagName: 'Dashboard-AWP3DX',
  TagType: 'Dashboard-AWP3DX',
  volumeSize: 50,
}
const SaocDashboardInstance = new SaocDashboardStack(app, 'SaocDashboard-AWP3DX', SaocDashboardStackProps);

//=================================================//
//=== stack for 3dspace creation                ===//
//=================================================//
const SaocSpaceStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Space-AWP3DX',
  TagName: 'Space-AWP3DX',
  TagType: 'Space-AWP3DX',
  volumeSize: 50,
}
const SaocSpaceInstance = new SaocSpaceStack(app, 'SaocSpace-AWP3DX', SaocSpaceStackProps);

//=================================================//
//=== stack for 3dcomment creation              ===//
//=================================================//
const SaocCommentStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Comment-AWP3DX',
  TagName: 'Comment-AWP3DX',
  TagType: 'Comment-AWP3DX',
  volumeSize: 50,
}
const SaocCommentInstance = new SaocCommentStack(app, 'SaocComment-AWP3DX', SaocCommentStackProps);

//=================================================//
//=== stack for 3dNotification creation         ===//
//=================================================//
const SaocNotificationStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Notification-AWP3DX',
  TagName: 'Notification-AWP3DX',
  TagType: 'Notification-AWP3DX',
  volumeSize: 50,
}
const SaocNotificationInstance = new SaocNotificationStack(app, 'SaocNotification-AWP3DX', SaocNotificationStackProps);

//=================================================//
//=== stack for Federated creation              ===//
//=================================================//
const SaocFederatedStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Federated-AWP3DX',
  TagName: 'Federated-AWP3DX',
  TagType: 'Federated-AWP3DX',
  volumeSize: 50,
}
const SaocFederatedInstance = new SaocFederatedStack(app, 'SaocFederated-AWP3DX', SaocFederatedStackProps);

//=================================================//
//=== stack for FCS creation                    ===//
//=================================================//
const SaocFcsStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Fcs-AWP3DX',
  TagName: 'Fcs-AWP3DX',
  TagType: 'Fcs-AWP3DX',
  volumeSize: 50,
}
const SaocFcsInstance = new SaocFcsStack(app, 'SaocFcs-AWP3DX', SaocFcsStackProps);

//=================================================//
//=== stack for FTS creation                    ===//
//=================================================//
const SaocFtsStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG005,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Fts-AWP3DX',
  TagName: 'Fts-AWP3DX',
  TagType: 'Fts-AWP3DX',
  volumeSize: 50,
}
const SaocFtsInstance = new SaocFtsStack(app, 'SaocFts-AWP3DX', SaocFtsStackProps);

//=================================================//
//=== stack for 3DIndexingServer creation       ===//
//=================================================//
const Saoc3DIndexStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'D3Index-AWP3DX',
  TagName: 'D3Index-AWP3DX',
  TagType: 'D3Index-AWP3DX',
  volumeSize: 50,
}
const Saoc3DIndexInstance = new Saoc3DIndexStack(app, 'Saoc3DIndex-AWP3DX', Saoc3DIndexStackProps);

//=================================================//
//=== stack for 3DSwym creation                 ===//
//=================================================//
const SaocSwymStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG006,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Swym-AWP3DX',
  TagName: 'Swym-AWP3DX',
  TagType: 'Swym-AWP3DX',
  volumeSize: 50,
}
const SaocSwymInstance = new SaocSwymStack(app, 'SaocSwym-AWP3DX', SaocSwymStackProps);

//=================================================//
//=== stack for 3DOrch creation                 ===//
//=================================================//
const SaocOrchStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Orch-AWP3DX',
  TagName: 'Orch-AWP3DX',
  TagType: 'Orch-AWP3DX',
  volumeSize: 50,
}
const SaocOrchInstance = new SaocOrchStack(app, 'SaocOrch-AWP3DX', SaocOrchStackProps);



//=================================================//
//=== stack for NFS creation                    ===//
//=================================================//
const SaocNfsStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG004,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'Nfs-AWP3DX',
  TagName: 'Nfs-AWP3DX',
  TagType: 'Nfs-AWP3DX',
  volumeSize: 100,
}
const SaocNfsInstance = new SaocNfsStack(app, 'SaocNfs-AWP3DX', SaocNfsStackProps);

//=================================================//
//=== stack for multi userData creation         ===//
//=================================================//
const userdataStackProps = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG006,
  subnetGroupName: 'Private',
  subnetID: 'subnet-0b084447b36c71c2e',
  avZone: 'us-west-2c',
  bucketName: 'dsis-3dexp-binaries-us-east-2-201113909371',
  ec2InstanceType: instanceTypeM5Large,
  ec2InstanceImage: Redhat8AMI,
  volumeType: gp3Type,
  InstanceName: 'userData-AWP3DX',
  TagName: 'userData-AWP3DX',
  TagType: 'userData-AWP3DX',
  volumeSize: 50,
}
const userdataInstance = new SaocUserdatasStack(app, 'multipartUserDataStack', userdataStackProps);

//=====================================//
//=== add stack dependency  ===========//
//=====================================//

SaocSpaceInstance.addDependency(SaocDBInstance)
SaocPassportInstance.addDependency(SaocDBInstance)
SaocDashboardInstance.addDependency(SaocDBInstance)
SaocCommentInstance.addDependency(SaocDBInstance)
SaocNotificationInstance.addDependency(SaocDBInstance)
SaocSwymInstance.addDependency(SaocDBInstance)

//===============================================================================================//
//================              SECTION TWO: create AMIs                             ============''
//================  This section is for documentation purpose using aws cli          ============//
//===============================================================================================//
//===                                                                                         ===//
//=== Example awscli command1 to get the EC2 instance Id from EC2 Instance tag Name           ===//
//===                                                                                         ===//
//aws ec2 describe-instances --query "Reservations[0].Instances[0].{Instance:InstanceId}"     ===//
//=== --filter 'Name=tag-value,Values=Database-AWP3DX' --output text                          ===//
//===============================================================================================//
//===                                                                                         ===//
//=== Example awscli command 2, to create AMI from an EC2 Instance id                         ===//
//===                                                                                         ===//
//=== aws ec2 create-image --name DatabaseAWP3DXAMI --instance-id i-07104a49acc9ff673         ===//
//===============================================================================================//


//===============================================================================================//
//===                  SECTION THREE: Launch different servers                                ===//
//=== This section launches different servers using the AMIs and autoscaling group            ===//
//===           line 463 to the end of the file                                               ===//
//===============================================================================================//
//=========================================//
//=== Variables used for Launching      ===//
//=========================================//
const avZone = 'us-west-2c'
const ownerId = '201113909371' //needs to be changed
const bucketName = 'dsis-3dexp-binaries-us-east-2-201113909371'
const dbPrivateIP = '10.4.12.10'
const subnetID = 'subnet-0b084447b36c71c2e'
const subnetIDBastion = 'subnet-0c8c9b80924a0e0c0'

//================================================//
//=== launch 0:  DB server in traditional EC2  ===//
//================================================//
const rhel8DatabaseServerAmi = new ec2.LookupMachineImage({
  name: 'DatabaseAWP3DXAMI',
  owners: [ownerId],
});

const rhel8ec2DatabaseProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG003,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8DatabaseServerAmi,
  tagName: 'RHEL8Ec2DbServer',
  tagType: 'RHEL8Ec2DbServer',
  avZone: avZone,
  roleName: 'RHEL8Ec2DbServerRole',
  ec2Name: 'RHEL8Ec2DbServer',
  bucketName: bucketName,
  privateIpAddress: dbPrivateIP,
}
const RHEL8Ec2Database = new RHEL8LaunchEc2DbServer(app, 'RHEL8Ec2DbServer', rhel8ec2DatabaseProp)

//===============================================//
//=== launch 1: autoscalinggroup Bastion     ===//
//===============================================//
const rhel8BastionServerAmi = new ec2.LookupMachineImage({
  name: 'BastionAWP3DXAMI',
  owners: [ownerId],
});
const rhel8AsgBastionProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG001,
  subnetID: subnetIDBastion,
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8BastionServerAmi,
  tagName: 'ASGBastionServer',
  tagType: 'ASGBastionServer',
  avZone: avZone,
  roleName: 'ASGBastionServerRole',
  asgName: 'ASGBastionServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGBastion = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGBastionServer', rhel8AsgBastionProp)

//===============================================//
//=== launch 2: autoscalinggroup passport     ===//
//===============================================//
const rhel8PassportServerAmi = new ec2.LookupMachineImage({
  name: 'PassportAWP3DXAMI',
  owners: [ownerId],
});
const rhel8AsgPassportProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: subnetID,
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8PassportServerAmi,
  tagName: 'ASGPassportServer',
  tagType: 'ASGPassportServer',
  avZone: avZone,
  roleName: 'AsgPassportServerRole',
  asgName: 'ASGPassportServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGPassport = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGPassportServer', rhel8AsgPassportProp)

//===============================================//
//=== launch 3: autoscalinggroup dashboard    ===//
//===============================================//
const rhel8DashboardServerAmi = new ec2.LookupMachineImage({
  name: 'DashboardAWP3DXAMI',
  owners: [ownerId],
});
const rhel8AsgDashboardProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: subnetID,
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8DashboardServerAmi,
  tagName: 'ASGDashboardServer',
  tagType: 'ASGDashboardServer',
  avZone: avZone,
  roleName: 'ASGDashboardServerRole',
  asgName: 'ASGDashboardServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGDashboard = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGDashboardServer', rhel8AsgDashboardProp)

//===============================================//
//=== launch 4: autoscalinggroup space        ===//
//===============================================//
const rhel8SpaceServerAmi = new ec2.LookupMachineImage({
  name: 'SpaceAWP3DXAMI',
  owners: [ownerId],
});
const rhel8AsgSpaceProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: subnetID,
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8SpaceServerAmi,
  tagName: 'ASGSpaceServer',
  tagType: 'ASGSpaceServer',
  avZone: avZone,
  roleName: 'ASGSpaceServerRole',
  asgName: 'ASGSpaceServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGSpace = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGSpaceServer', rhel8AsgSpaceProp)

//============================================//
//=== launch 5: 3dswym autoscalinggroup    ===//
//============================================//
const rhel8SwymServerAmi = new ec2.LookupMachineImage({
  name: 'SwymAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgSwymProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG006,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8SwymServerAmi,
  tagName: 'ASGSwymServer',
  tagType: 'ASGSwymServer',
  avZone: avZone,
  roleName: 'AsgSwymServerRole',
  asgName: 'ASGSwymServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGSwym = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGSwymServer', rhel8AsgSwymProp)

//============================================//
//=== launch 6: 3dcomment autoscalinggroup ===//
//============================================//
const rhel8CommentServerAmi = new ec2.LookupMachineImage({
  name: 'CommentAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgCommentProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8CommentServerAmi,
  tagName: 'ASGCommentServer',
  tagType: 'ASGCommentServer',
  avZone: avZone,
  roleName: 'ASGCommentServerRole',
  asgName: 'ASGCommentServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGComment = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGCommentServer', rhel8AsgCommentProp)

//====================================================//
//=== launch 7: 3dnotification autoscalinggroup    ===//
//====================================================//

const rhel8NotificationServerAmi = new ec2.LookupMachineImage({
  name: 'NotificationAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgNotificationProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8NotificationServerAmi,
  tagName: 'ASGNotificationServer',
  tagType: 'ASGNotificationServer',
  avZone: avZone,
  roleName: 'ASGNotificationServerRole',
  asgName: 'ASGNotificationServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGNotification = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGNotificationServer', rhel8AsgNotificationProp)

//====================================================//
//=== launch 8: federated autoscalinggroup         ===//
//====================================================//

const rhel8FederatedServerAmi = new ec2.LookupMachineImage({
  name: 'FederatedAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgFederatedProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8FederatedServerAmi,
  tagName: 'ASGFederatedServer',
  tagType: 'ASGFederatedServer',
  avZone: avZone,
  roleName: 'ASGFederatedServerRole',
  asgName: 'ASGFederatedServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGFederated = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGFederatedServer', rhel8AsgFederatedProp)

//====================================================//
//=== launch 9: FCS autoscalinggroup               ===//
//====================================================//

const rhel8FcsServerAmi = new ec2.LookupMachineImage({
  name: 'FcsAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgFcsProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8FcsServerAmi,
  tagName: 'ASGFcsServer',
  tagType: 'ASGFcsServer',
  avZone: avZone,
  roleName: 'ASGFcsServerRole',
  asgName: 'ASGFcsServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGFcs = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGFcsServer', rhel8AsgFcsProp)

//====================================================//
//=== launch 10: FTS autoscalinggroup              ===//
//====================================================//

const rhel8FtsServerAmi = new ec2.LookupMachineImage({
  name: 'FtsAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgFtsProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG005,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8FtsServerAmi,
  tagName: 'ASGFtsServer',
  tagType: 'ASGFtsServer',
  avZone: avZone,
  roleName: 'ASGFtsServerRole',
  asgName: 'ASGFtsServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGFts = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGFtsServer', rhel8AsgFtsProp)

//====================================================//
//=== launch 11: NFS autoscalinggroup              ===//
//====================================================//

const rhel8NfsServerAmi = new ec2.LookupMachineImage({
  name: 'NfsAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgNfsProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG004,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8NfsServerAmi,
  tagName: 'ASGNfsServer',
  tagType: 'ASGNfsServer',
  avZone: avZone,
  roleName: 'ASGNfsServerRole',
  asgName: 'ASGNfsServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGNfs = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGNfsServer', rhel8AsgNfsProp)

//====================================================//
//=== launch 12: 3DIndex autoscalinggroup          ===//
//====================================================//

const rhel83DIndexServerAmi = new ec2.LookupMachineImage({
  name: 'D3IndexAWP3DXAMI',
  owners: [ownerId],
});

const rhel8Asg3DIndexProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG004,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel83DIndexServerAmi,
  tagName: 'ASG3DIndexServer',
  tagType: 'ASG3DIndexServer',
  avZone: avZone,
  roleName: 'ASG3DIndexServerRole',
  asgName: 'ASG3DIndexServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASG3DIndex = new RHEL8LaunchASGAppServer(app, 'RHEL8ASG3DIndexServer', rhel8Asg3DIndexProp)
//====================================================//
//=== launch 13: federated autoscalinggroup         ===//
//====================================================//

const rhel8OrchServerAmi = new ec2.LookupMachineImage({
  name: 'OrchAWP3DXAMI',
  owners: [ownerId],
});

const rhel8AsgOrchProp = {
  env: { account: process.env.CDK_DEFAULT_ACCOUNT, region: process.env.CDK_DEFAULT_REGION },
  vpc: vpc,
  securityGroup: mySG002,
  subnetID: 'subnet-0b084447b36c71c2e',
  ec2InstanceType: instanceTypeM5Large, //use the proper one when deploying
  ec2InstanceImage: rhel8OrchServerAmi,
  tagName: 'ASGOrchServer',
  tagType: 'ASGOrchServer',
  avZone: avZone,
  roleName: 'ASGOrchServerRole',
  asgName: 'ASGOrchServer',
  bucketName: bucketName,
  minCapacity: 1,
  desiredCapacity: 1,
  maxCapacity: 1,
}
const RHEL8ASGOrch = new RHEL8LaunchASGAppServer(app, 'RHEL8ASGOrchServer', rhel8AsgOrchProp)