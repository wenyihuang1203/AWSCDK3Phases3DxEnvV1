import {aws_ec2 as ec2 } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import * as cdk from 'aws-cdk-lib';
import { CfnInstanceProfile } from 'aws-cdk-lib/aws-iam';
import { App, Stack, StackProps, CfnOutput, Environment, Tags } from 'aws-cdk-lib';
import { IVpc, SecurityGroup, Subnet } from 'aws-cdk-lib/aws-ec2';
import * as autoscaling from 'aws-cdk-lib/aws-autoscaling'

interface RHEL8LaunchEc2DbServerProps extends StackProps {
  env: Environment,
  vpc: IVpc,
  securityGroup: SecurityGroup,
  subnetID: string,
  ec2InstanceType: ec2.InstanceType,
  ec2InstanceImage: ec2.IMachineImage,
  tagName: string,
  tagType: string,
  avZone: string,
  roleName: string,
  ec2Name: string,
  bucketName: string,
  privateIpAddress: string
}

export class RHEL8LaunchEc2DbServer extends Stack {
	constructor(scope: App, id: string, props: RHEL8LaunchEc2DbServerProps) {
        super(scope, id, props)

  // Get the name of the S3 bucket to which the instance will have access
    const bucket_name = props.bucketName

    const s3PolicyStatement = new iam.PolicyStatement({ effect: iam.Effect.ALLOW, sid: "s3Policy"})
    s3PolicyStatement.addActions("s3:GetObject", "s3:PutObject","s3:ListBucket")
    s3PolicyStatement.addResources(`arn:aws:s3:::${bucket_name}`, `arn:aws:s3:::${bucket_name}/*`)

    const instanceIAMPolicy = new iam.PolicyDocument()
    instanceIAMPolicy.addStatements(s3PolicyStatement)

    const ec2PassportServerRole = new iam.Role(this, props.roleName,
      {
        assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
        description: "Role for ASG Server Instances",
        roleName: props.roleName,
        managedPolicies: [
          iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy"),
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
          iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMPatchAssociation")
        ],
        inlinePolicies: {
          AppServerPolicy: instanceIAMPolicy
        }
      }
    );
    const ssmUserData = ec2.UserData.forLinux();
    ssmUserData.addCommands( 'aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/amazon-ssm-agent.gpg /tmp/amazon-ssm-agent.gpg',
          'sudo rpm --import /tmp/amazon-ssm-agent.gpg',
          'sudo yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm',
          'sudo systemctl restart amazon-ssm-agent',
          'sudo systemctl enable amazon-ssm-agent',
          'sudo mount /dev/nvme1n1 /db/txlogs',
          'sudo mount /dev/nvme2n1 /db/system',
          'sudo mount /dev/nvme3n1 /db/temp',
          'sudo mount /dev/nvme4n1 /db/user',
          )
        
    const ec2Instance = new ec2.Instance(this, props.ec2Name, {
            instanceName: props.ec2Name,
            vpc: props.vpc,
            privateIpAddress: props.privateIpAddress,
            instanceType: props.ec2InstanceType,
            machineImage: props.ec2InstanceImage,
            role: ec2PassportServerRole,
            keyName: 'MyKeyPair',
            securityGroup: props.securityGroup,
            vpcSubnets: { subnets: 
                                [ Subnet.fromSubnetAttributes(this, props.subnetID, {
                                  subnetId: props.subnetID,
                                  availabilityZone: props.avZone,}) 
                                ] 
                        },
            userData : ssmUserData,
     }
    )  //end of ec2 DBServer

    Tags.of(ec2Instance).add('Name', props.tagName);
    Tags.of(ec2Instance).add('Type', props.tagType);
  }
}