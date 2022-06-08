import { Stack, StackProps } from 'aws-cdk-lib';
import { Construct } from 'constructs';
import { aws_ec2 } from 'aws-cdk-lib';
import { IVpc } from 'aws-cdk-lib/aws-ec2';
import { Environment } from 'aws-cdk-lib';

interface myVpcStackProps extends StackProps {
  env: Environment,
  myVpcName: string,
  stackName: string
}

export class SAOCgetVPC extends Stack {
  readonly vpc: IVpc;
  constructor(scope: Construct, id: string, props: myVpcStackProps) {
    super(scope, id, props);
    this.vpc = aws_ec2.Vpc.fromLookup(this, props.stackName, {
      vpcName: props.myVpcName,
    })
  }
}