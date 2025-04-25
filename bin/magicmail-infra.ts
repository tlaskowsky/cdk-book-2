#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from 'aws-cdk-lib';
import { MagicmailInfraStack } from '../lib/magicmail-infra-stack';
import { GitLabServerStack } from '../lib/gitlab-server-stack'; // <-- Import the new stack

const app = new cdk.App();

// Define the environment (account/region) - reuse for both stacks
// Ensure these environment variables are set in your terminal or CI/CD environment
// OR replace with explicit { account: 'YOUR_ACCOUNT_ID', region: 'YOUR_REGION' }
const deploymentEnv = {
account: process.env.CDK_DEFAULT_ACCOUNT,
region: process.env.CDK_DEFAULT_REGION
};

// Instantiate the original MagicMail stack (from Book 1)
new MagicmailInfraStack(app, 'MagicmailInfraStack', {
env: deploymentEnv,
description: 'Stack for MagicMail core infrastructure (e.g., S3 bucket)'
});

// Instantiate the new GitLab Server stack
new GitLabServerStack(app, 'GitLabServerStack', {
env: deploymentEnv,
description: 'Stack for deploying the self-hosted GitLab CE server'
});

// Optional: Add tags to all stacks within the app
cdk.Tags.of(app).add('Project', 'MagicMailBook');