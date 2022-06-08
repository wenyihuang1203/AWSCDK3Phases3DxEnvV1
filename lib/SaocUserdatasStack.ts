import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { SecurityGroup, IVpc, EbsDeviceVolumeType, Subnet } from 'aws-cdk-lib/aws-ec2';
import { aws_autoscaling as autoscaling } from 'aws-cdk-lib';
import { App, Stack, StackProps, CfnOutput, Environment, Tags, CfnParameter, } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { FileSystem } from 'aws-cdk-lib/aws-efs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';
import { Ec2Action } from 'aws-cdk-lib/aws-cloudwatch-actions';



interface userdataStackProps extends StackProps {
	env: Environment,
    vpc: IVpc,
	securityGroup: SecurityGroup,
	subnetID: string,
	avZone: string,
	bucketName: string,
	InstanceName: string,
	TagName: string,
	TagType: string,
	ec2InstanceType: ec2.InstanceType,
	ec2InstanceImage: ec2.IMachineImage,
	//privateIpAddress: string,
	volumeSize: number,
	volumeType: ec2.EbsDeviceVolumeType,
	subnetGroupName: string
}
export class SaocUserdatasStack extends Stack {
    readonly userdata1: string []
    constructor(scope: App, id: string, props: userdataStackProps){	
        super(scope, id, props)	 

        const bucket_name = props.bucketName
        const s3PolicyStatement = new iam.PolicyStatement({ effect: iam.Effect.ALLOW, sid: "s3Policy"})
        s3PolicyStatement.addActions("s3:GetObject", "s3:PutObject","s3:ListBucket")
        s3PolicyStatement.addResources(`arn:aws:s3:::${bucket_name}`, `arn:aws:s3:::${bucket_name}/*`)

        const instanceIAMPolicy = new iam.PolicyDocument()
        instanceIAMPolicy.addStatements(s3PolicyStatement)
        const instanceRoleName = props.InstanceName + 'Role'
        const instanceRole = new iam.Role(this,instanceRoleName,{
	        assumedBy: new iam.ServicePrincipal("ec2.amazonaws.com"),
	        description: "Role for EC2 Redhat8 Instances",
	        roleName: instanceRoleName,
	        managedPolicies: [
	                            iam.ManagedPolicy.fromAwsManagedPolicyName("CloudWatchAgentServerPolicy"),
	                            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMManagedInstanceCore"),
	                            iam.ManagedPolicy.fromAwsManagedPolicyName("AmazonSSMPatchAssociation")
	                         ],
	        inlinePolicies: {
	                AppServerPolicy: instanceIAMPolicy
	        }
        });
        
        const commandsUserData = ec2.UserData.forLinux();
        
        commandsUserData.addCommands('sudo yum upgrade -y',
        'sudo yum install sed zip unzip curl -y',
        'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/var/tmp/awscliv2.zip"',
        'sudo unzip /var/tmp/awscliv2.zip -d /var/tmp/',
        'sudo /var/tmp/aws/install',
        'aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/amazon-ssm-agent.gpg /tmp/amazon-ssm-agent.gpg',
        'sudo rpm --import /tmp/amazon-ssm-agent.gpg',
        'sudo yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm',
        'sudo systemctl restart amazon-ssm-agent',
        'sudo systemctl enable amazon-ssm-agent');
        
        const multipartUserData = new ec2.MultipartUserData();
        multipartUserData.addUserDataPart(commandsUserData, ec2.MultipartBody.SHELL_SCRIPT, true);
        
        const asset = new Asset(this, 'Asset', {
            path: './documents/commonPackages.sh'
        });
    
        const localPath = multipartUserData.addS3DownloadCommand({
            bucket: asset.bucket,
            bucketKey: asset.s3ObjectKey,
            region: 'us-west-2', // Optional
          });

        multipartUserData.addExecuteFileCommand({ filePath: localPath});
        asset.grantRead(instanceRole);

        const ec2TestInstance = new ec2.Instance(this, "wh3testec2MultipartUserData", {
            vpc: props.vpc,
            //instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
            instanceType: props.ec2InstanceType,
            //machineImage: Redhat8AMI,
            machineImage:props.ec2InstanceImage,
            securityGroup: props.securityGroup,
            keyName: 'MyKeyPair',
            role: instanceRole,
            //privateIpAddress: props.privateIpAddress,
            userData: multipartUserData,
            //vpcSubnets:  { subnetGroupName: props.subnetGroupName},
            vpcSubnets: { subnets: 
                [ Subnet.fromSubnetAttributes(this, props.subnetID, {
                  subnetId: props.subnetID,
                  availabilityZone: props.avZone,}) 
                ] 
            }
        });
     

    }

}