import {App, Stack, StackProps, CfnOutput, Environment, Tags, RemovalPolicy, FileSystem} from 'aws-cdk-lib'
import {Peer, Port, SecurityGroup, IVpc, FlowLogDestination} from 'aws-cdk-lib/aws-ec2'
import * as s3 from 'aws-cdk-lib/aws-s3'
import * as iam from 'aws-cdk-lib/aws-iam'
import * as logs from 'aws-cdk-lib/aws-logs'
import * as kms from 'aws-cdk-lib/aws-kms'
import { networkInterfaces } from 'os'
import { aws_ec2 as ec2 } from 'aws-cdk-lib';

interface createSecurityStackProps extends StackProps {
    env: Environment,
    vpc: IVpc,
    prefix: string,
    sg1Name: string,
    sg2Name: string,
    sg3Name: string,
    sg4Name: string,
    sg5Name: string,
    sg6Name: string,
    sg1Title: string,
    sg2Title: string,
    sg3Title: string,
    sg4Title: string,
    sg5Title: string,
    sg6Title: string,
}

export class SAOCcreateSecurityGroup extends Stack {
    readonly kms_key: kms.Key
    readonly appServerSG: SecurityGroup
    readonly bastionServerSG: SecurityGroup
    readonly dbServerSG: SecurityGroup
    readonly fileServerSG: SecurityGroup
    readonly spaceIndexServerSG: SecurityGroup
    readonly swymIndexServerSG: SecurityGroup

    constructor(scope: App, id: string, props: createSecurityStackProps) {
        super(scope, id, props)
		//------------------------------------------------------------------
    // Create Security Group Bastion 
    //------------------------------------------------------------------
    this.bastionServerSG = new ec2.SecurityGroup(this, props.sg1Title, {
            vpc: props.vpc,
            allowAllOutbound: true,
            //securityGroupName: `${props.prefix}`
            securityGroupName: props.sg1Name,
     });

          //------------------------------------------------------------------
          // for SSH Access My Network only and all on port 443
          //------------------------------------------------------------------
          //this.bastionServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
          this.bastionServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
          /***
          props.allowedNetworks.forEach( (network) => {
            this.proxyServerSG.addIngressRule(ec2.Peer.ipv4(network), ec2.Port.tcp(22));
            this.proxyServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443));
            this.proxyServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80));
           })
           ***/
          //Tags.of(this.bastionServerSG).add('Name', this.stackName.concat(":").concat("Bastion-Server-SG-001"))
          Tags.of(this.bastionServerSG).add('Name', this.stackName.concat(":").concat(props.sg1Name))


        //------------------------------------------------------------------
        // Create Security Group SG-002
        //------------------------------------------------------------------
        this.appServerSG = new ec2.SecurityGroup(this, props.sg2Title , {
        vpc: props.vpc,
        allowAllOutbound: true,
        securityGroupName: props.sg2Name,
      });

      //------------------------------------------------------------------
      // for SSH Access
      //------------------------------------------------------------------
      this.appServerSG.addIngressRule(this.bastionServerSG, ec2.Port.tcp(22));
      this.appServerSG.addIngressRule(this.bastionServerSG, ec2.Port.tcp(443));
      this.appServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
      //Tags.of(this.appServerSG).add('Name', `${props.prefix}/ssh-SG`);
      //Tags.of(this.appServerSG).add('Name', this.stackName.concat(":").concat("App-Server-SG-002"))
      Tags.of(this.appServerSG).add('Name', this.stackName.concat(":").concat(props.sg2Name))

        //------------------------------------------------------------------
        // Create Security Group SG-003
        //------------------------------------------------------------------
        this.dbServerSG = new ec2.SecurityGroup(this, props.sg3Title, {
          vpc: props.vpc,
          allowAllOutbound: true,
          securityGroupName: props.sg3Name,
        });
  
        //------------------------------------------------------------------
        // for SSH Access  My Network only and SG proxyServerSG on port 8080
        //------------------------------------------------------------------
        this.dbServerSG.addIngressRule(this.bastionServerSG, ec2.Port.tcp(22));
        this.dbServerSG.addIngressRule(this.appServerSG, ec2.Port.tcp(1433));
        //this.dbServerSG.addIngressRule(this.swymIndexServerSG, ec2.Port.tcp(1433));
        this.dbServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
        Tags.of(this.dbServerSG).add('Name', this.stackName.concat(":").concat(props.sg3Name))

        //------------------------------------------------------------------
        // Create Security Group SG-004
        //------------------------------------------------------------------
        this.fileServerSG = new ec2.SecurityGroup(this, props.sg4Title, {
          vpc: props.vpc,
          allowAllOutbound: true,
          securityGroupName: props.sg4Name,
        });
  
        //------------------------------------------------------------------
        // for SSH Access  My Network only and SG proxyServerSG on port 8080
        //------------------------------------------------------------------
        this.fileServerSG.addIngressRule(this.bastionServerSG, ec2.Port.tcp(22));
        this.fileServerSG.addIngressRule(this.appServerSG, ec2.Port.tcp(19000));
        this.fileServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
        Tags.of(this.fileServerSG).add('Name', this.stackName.concat(":").concat(props.sg4Name))

        //------------------------------------------------------------------
        // Create Security Group SG-005
        //------------------------------------------------------------------
        this.spaceIndexServerSG = new ec2.SecurityGroup(this, props.sg5Title, {
          vpc: props.vpc,
          allowAllOutbound: true,
          securityGroupName: props.sg5Name,
        });
  
        //------------------------------------------------------------------
        // for SSH Access  My Network only and SG proxyServerSG on port 8080
        //------------------------------------------------------------------
        this.spaceIndexServerSG.addIngressRule(this.bastionServerSG, ec2.Port.tcp(22));
        this.spaceIndexServerSG.addIngressRule(this.appServerSG, ec2.Port.tcp(19000));
        this.spaceIndexServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));
        Tags.of(this.spaceIndexServerSG).add('Name', this.stackName.concat(":").concat(props.sg5Name))

        //------------------------------------------------------------------
        // Create Security Group SG-006
        //------------------------------------------------------------------
        this.swymIndexServerSG = new ec2.SecurityGroup(this, props.sg6Title, {
          vpc: props.vpc,
          allowAllOutbound: true,
          securityGroupName: props.sg6Name,
        });
  
        //------------------------------------------------------------------
        // for SSH Access  My Network only and SG proxyServerSG on port 8080
        //------------------------------------------------------------------
        this.swymIndexServerSG.addIngressRule(this.bastionServerSG, ec2.Port.tcp(22));
        this.swymIndexServerSG.addIngressRule(this.appServerSG, ec2.Port.tcp(29000));
        this.swymIndexServerSG.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(22));

        this.dbServerSG.addIngressRule(this.swymIndexServerSG, ec2.Port.tcp(1433));
        Tags.of(this.swymIndexServerSG).add('Name', this.stackName.concat(":").concat(props.sg6Name))

    


    }
}