import * as cdk from 'aws-cdk-lib';
import { aws_ec2 as ec2 } from 'aws-cdk-lib';
import { SecurityGroup, IVpc, EbsDeviceVolumeType, Subnet } from 'aws-cdk-lib/aws-ec2';
import { aws_autoscaling as autoscaling } from 'aws-cdk-lib';
import { App, Stack, StackProps, CfnOutput, Environment, Tags, CfnParameter, } from 'aws-cdk-lib';
import * as iam from 'aws-cdk-lib/aws-iam';
import { FileSystem } from 'aws-cdk-lib/aws-efs';
import { aws_ssm as ssm } from 'aws-cdk-lib';
import { Asset } from 'aws-cdk-lib/aws-s3-assets';


interface SaocDatabaseStackProps extends StackProps {
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
	privateIpAddress: string,
	volumeSize: number,
	volumeSize2: number,
	volumeSize3: number,
	volumeSize4: number,
	volumeType: ec2.EbsDeviceVolumeType,
	subnetGroupName: string
}
/*
    // Define a user data script to install & launch our web server
    const ssmUserData = ec2.UserData.forLinux();
    // Make sure the latest SSM Agent, AWS CLI and unzip are installed and update the OS
    //const SSM_AGENT_RPM ="https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm";

    ssmUserData.addCommands('yum upgrade -y',
	'sudo yum install sed zip unzip curl -y',
    'curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "/var/tmp/awscliv2.zip"',
    'sudo unzip /var/tmp/awscliv2.zip -d /var/tmp/',
    'sudo /var/tmp/aws/install',
	'aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/amazon-ssm-agent.gpg /tmp/amazon-ssm-agent.gpg',
    'sudo rpm --import /tmp/amazon-ssm-agent.gpg',
    'sudo yum install -y https://s3.amazonaws.com/ec2-downloads-windows/SSMAgent/latest/linux_amd64/amazon-ssm-agent.rpm',
	//`yum install -y ${SSM_AGENT_RPM}`,
	'systemctl restart amazon-ssm-agent',
    'systemctl enable amazon-ssm-agent',
    'yum install lsb -y',
    'yum install git -y',
    'yum install wget -y',
    'yum install lsof -y',
    'yum install telnet -y',
    'yum install net-tools -y',
    'yum install httpd -y',
    'yum -y install nfs-utils',
    'systemctl restart httpd',
    'systemctl enable httpd',
	'yum install amazon-efs-utils nfs-utils nmap-ncat -y',
	// perl -e 'print crypt("Passport123", "salt")' to get the crypted passwd
	"USERNAME=webapp",
    'useradd -m -p sal/Jvl0B52ok ${USERNAME}',
    'usermod -aG wheel ${USERNAME}',
	//make additional disk 1
	'mkfs -t ext4 /dev/nvme2n1',
    'e2label /dev/nvme2n1 /db/system',
    'sudo mkdir -p /db/system/',
    'sudo echo "LABEL=/db/system /db/system ext4 defaults 1 2" >> /etc/fstab',
    'mount /db/system',
    'sudo chown -R ${USERNAME}:${USERNAME} /db/system',
	//make additional disk 2
	'sudo mkfs -t ext4 /dev/nvme4n1',
    'e2label /dev/nvme4n1 /db/user',
    'sudo mkdir -p /db/user',
    'sudo echo "LABEL=/db/user /db/user ext4 defaults 1 2" >> /etc/fstab',
    'sudo mount /db/user',
    'sudo chown -R ${USERNAME}:${USERNAME} /db/user',
	//make additional disk 3
	'mkfs -t ext4 /dev/nvme3n1',
    'e2label /dev/nvme3n1 /db/temp',
    'sudo mkdir -p /db/temp',
    'sudo echo "LABEL=/db/temp /db/temp ext4 defaults 1 2" >> /etc/fstab',
    'sudo mount /db/temp',
    'sudo chown -R ${USERNAME}:${USERNAME} /db/temp',
	//make additional disk 4
	'mkfs -t ext4 /dev/nvme1n1',
    'e2label /dev/nvme1n1 /db/txlogs',
    'sudo mkdir -p /db/txlogs',
    'sudo echo "LABEL=/db/txlogs /txlogs ext4 defaults 1 2" >> /etc/fstab',
    'mount /db/txlogs',
    'sudo chown -R ${USERNAME}:${USERNAME} /db/txlogs',
    'aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/create22xdbs.sql /tmp/create22xdbs.sql',
	'aws s3 cp s3://dsis-3dexp-binaries-us-east-2-201113909371/r2022x/components/orchdb.sql /tmp/orchdb.sql',
    'export MSSQL_SA_PASSWORD=Sqlserver1',
    'export MSSQL_PID=express',
    'export SQL_ENABLE_AGENT=y',
	'sudo curl -o /etc/yum.repos.d/mssql-server.repo https://packages.microsoft.com/config/rhel/8/mssql-server-2019.repo',
    'sudo curl -o /etc/yum.repos.d/msprod.repo https://packages.microsoft.com/config/rhel/8/prod.repo',
    'sudo yum install -y mssql-server',
    'sudo systemctl stop mssql-server',
    'MSSQL_SA_PASSWORD=${MSSQL_SA_PASSWORD} MSSQL_PID=${MSSQL_PID} /opt/mssql/bin/mssql-conf -n setup accept-eula',
    'sudo ACCEPT_EULA=Y yum install -y mssql-tools unixODBC-devel',
    'sudo echo PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bash_profile',
    'sudo echo export PATH="$PATH:/opt/mssql-tools/bin" >> ~/.bashrc',
    'source ~/.bashrc',
    'sudo systemctl restart mssql-server',
    'sudo chmod 777 /db/system', 
    '/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${MSSQL_SA_PASSWORD} -i /tmp/create22xdbs.sql -o /tmp/create22xdbs.log',
	'/opt/mssql-tools/bin/sqlcmd -S localhost -U SA -P ${MSSQL_SA_PASSWORD} -i /tmp/orchdb.sql -o /tmp/orchdb.log',
	); */


export class SaocDatabaseStack extends Stack {
	constructor(scope: App, id: string, props: SaocDatabaseStackProps) {
        super(scope, id, props)

// start of adding access to the s3 bucket

const bucket_name = props.bucketName;

const s3PolicyStatement = new iam.PolicyStatement({ effect: iam.Effect.ALLOW, sid: "s3Policy"})
s3PolicyStatement.addActions("s3:GetObject", "s3:PutObject","s3:ListBucket")
s3PolicyStatement.addResources(`arn:aws:s3:::${bucket_name}`, `arn:aws:s3:::${bucket_name}/*`)

const instanceIAMPolicy = new iam.PolicyDocument()
instanceIAMPolicy.addStatements(s3PolicyStatement)
const instanceRoleName = props.InstanceName + 'Role'
const instanceRole = new iam.Role(this,instanceRoleName,
  {
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
   }
  );
  //=========================================//
  //=== end of adding s3 bucket access    ===//
  //=========================================//
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
  //==========================================================//
  //=== Common scripts File as asset to execute            ===//
  //==========================================================//    
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

  //==========================================================//
  //=== DB Server Install scripts File as asset to execute ===//
  //==========================================================//
  const assetDBServer = new Asset(this, 'AssetDBServer', {
	path: './documents/dbServerInstall.sh'
  });
  const localPath2 = multipartUserData.addS3DownloadCommand({
	bucket: assetDBServer.bucket,
	bucketKey: assetDBServer.s3ObjectKey,
	region: 'us-west-2', // Optional
  });
  multipartUserData.addExecuteFileCommand({ filePath: localPath2});  
  assetDBServer.grantRead(instanceRole);
  
  //======================================================//
  //=== create a new EC2 instance ========================//
  //======================================================//

	const SaocDBInstance = new ec2.Instance(this, props.InstanceName, {
		vpc: props.vpc,
		//instanceType: ec2.InstanceType.of(ec2.InstanceClass.C5, ec2.InstanceSize.LARGE),
		instanceType: props.ec2InstanceType,
  	    //machineImage: Redhat8AMI,
		machineImage:props.ec2InstanceImage,
		securityGroup: props.securityGroup,
		keyName: 'MyKeyPair',
		role: instanceRole,
		privateIpAddress: props.privateIpAddress,
		userData: multipartUserData,
		//vpcSubnets:  { subnetGroupName: props.subnetGroupName},
		vpcSubnets: { subnets: 
			[ Subnet.fromSubnetAttributes(this, props.subnetID, {
			  subnetId: props.subnetID,
			  availabilityZone: props.avZone,}) 
			] 
		},
		blockDevices: [
			{
			  deviceName: '/dev/xvda',
			  volume: ec2.BlockDeviceVolume.ebs(props.volumeSize, { deleteOnTermination: true, 
				volumeType: props.volumeType,
			    }),
			},
			{
				deviceName: '/dev/xvdb',
				volume: ec2.BlockDeviceVolume.ebs(props.volumeSize2, { deleteOnTermination: true, 
				  volumeType: props.volumeType,
				  }),
			},
			{
				deviceName: '/dev/xvdc',
				volume: ec2.BlockDeviceVolume.ebs(props.volumeSize3, { deleteOnTermination: true, 
				  volumeType: props.volumeType,
				  }),
			},
			{
				deviceName: '/dev/xvdd',
				volume: ec2.BlockDeviceVolume.ebs(props.volumeSize4, { deleteOnTermination: true, 
				  volumeType: props.volumeType,
				}),
		    }
		  ]
		});
	

		Tags.of(SaocDBInstance).add('Name', props.TagName);
		Tags.of(SaocDBInstance).add('Type', props.TagType);

	}
}