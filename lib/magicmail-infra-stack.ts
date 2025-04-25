import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as s3 from 'aws-cdk-lib/aws-s3';

export class MagicmailInfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- Get context values ---
    // Use node.tryGetContext to safely retrieve context values
    const environment = this.node.tryGetContext('environment'); // Retrieves from cdk.json or CLI
    const project = this.node.tryGetContext('project');

    // Basic validation or default setting
    if (!environment || !project) {
      throw new Error("Context variables 'environment' and 'project' must be set in cdk.json or via --context");
    }

    // --- Define S3 Asset Bucket ---
    // This bucket stores assets like design files and mockups for MagicMail. <--- ADD THIS COMMENT
    const assetsBucket = new s3.Bucket(this, 'MagicMailAssetsBucket', {
      versioned: true,
      encryption: s3.BucketEncryption.S3_MANAGED,
      blockPublicAccess: s3.BlockPublicAccess.BLOCK_ALL,
      // Use context value to determine Removal Policy
      removalPolicy: environment === 'prod' ? cdk.RemovalPolicy.RETAIN : cdk.RemovalPolicy.DESTROY,
      autoDeleteObjects: environment !== 'prod', // Enable auto-delete only for non-prod
      lifecycleRules: [/* ... */],
    });

    // --- Define DynamoDB Table for Creatures (Placeholder) --- <--- ADD THIS COMMENT
    // const creatureTable = new dynamodb.Table(this, 'CreatureTable', { ... });

    // --- Add Tags ---
    cdk.Tags.of(assetsBucket).add('Project', project); // Use project context value
    cdk.Tags.of(assetsBucket).add('Environment', environment); // Use environment context value

    // --- Define Outputs ---
    // ... existing outputs ...
    // Modify export names to include environment for uniqueness if needed across environments
    new cdk.CfnOutput(this, 'AssetsBucketNameOutput', {
        value: assetsBucket.bucketName,
        description: `The name of the S3 bucket for ${environment} assets`,
        exportName: `${project}-${environment}-AssetsBucketName`, // More unique export name
    });
    new cdk.CfnOutput(this, 'AssetsBucketArnOutput', {
        value: assetsBucket.bucketArn,
        description: `The ARN of the S3 bucket for ${environment} assets`,
        exportName: `${project}-${environment}-AssetsBucketArn`,
    });
  }
}