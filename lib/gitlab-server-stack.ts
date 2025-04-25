// lib/gitlab-server-stack.ts

import * as cdk from 'aws-cdk-lib';
import { Construct } from 'constructs';
import * as ec2 from 'aws-cdk-lib/aws-ec2';
import * as iam from 'aws-cdk-lib/aws-iam';

export class GitLabServerStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    // --- VPC ---
    const vpc: ec2.IVpc = ec2.Vpc.fromLookup(this, 'Vpc', { isDefault: true });

    // --- IAM Role for EC2 Instance (for SSM Access) ---
    const instanceRole = new iam.Role(this, 'GitLabInstanceRole', {
      assumedBy: new iam.ServicePrincipal('ec2.amazonaws.com'),
      description: 'IAM Role for GitLab EC2 instance to allow SSM access',
    });
    instanceRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName('AmazonSSMManagedInstanceCore')
    );

    // --- Security Group ---
    const gitlabSecurityGroup = new ec2.SecurityGroup(this, 'GitLabSecurityGroup', {
      vpc: vpc,
      description: 'Allow HTTP, HTTPS access to GitLab server',
      allowAllOutbound: true,
    });
    gitlabSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(80), 'Allow HTTP access');
    gitlabSecurityGroup.addIngressRule(ec2.Peer.anyIpv4(), ec2.Port.tcp(443), 'Allow HTTPS access');

    // --- EBS Volume Definitions ---
    // Define the device name as a constant - Use NVMe name
    const dataVolumeDeviceName: string = '/dev/sdf';
    const dataVolumeConfig: ec2.BlockDeviceVolume = ec2.BlockDeviceVolume.ebs(100, {
        volumeType: ec2.EbsDeviceVolumeType.GP3,
        encrypted: true,
        deleteOnTermination: false,
    });
    const dataBlockDevice: ec2.BlockDevice = {
        deviceName: dataVolumeDeviceName,
        volume: dataVolumeConfig,
    };
    const rootVolumeConfig: ec2.BlockDeviceVolume = ec2.BlockDeviceVolume.ebs(50, {
        volumeType: ec2.EbsDeviceVolumeType.GP3,
        encrypted: true,
    });
    const rootBlockDevice: ec2.BlockDevice = {
        deviceName: '/dev/sda1', // Common root device name for Ubuntu AMIs
        volume: rootVolumeConfig,
    };

    // --- EC2 Instance ---
    const userData = ec2.UserData.forLinux();
    const gitlabMountPoint: string = '/var/opt/gitlab';
    userData.addCommands(
      'echo "--- Formatting and Mounting Data Volume ---"',
      // Wait for NVMe devices to initialize (up to 60 seconds)
      'for i in {1..60}; do [ -e /dev/nvme1n1 ] && break || sleep 1; done',
      
      // Find EBS volume using persistent symlink
      'DATA_DEVICE=$(realpath /dev/disk/by-id/nvme-Amazon_Elastic_Block_Store_*)',
      '[ -b "$DATA_DEVICE" ] || DATA_DEVICE="/dev/nvme1n1"',
    
      'if [ -b "$DATA_DEVICE" ]; then',
      '  echo "Found EBS volume at $DATA_DEVICE"',
      // Check filesystem
      '  if ! blkid $DATA_DEVICE; then',
      '    echo "Formatting $DATA_DEVICE with ext4"',
      '    mkfs -t ext4 -q $DATA_DEVICE',
      '  fi',
      
      // Create mount point
      `  mkdir -p ${gitlabMountPoint}`,
      
      // Get UUID and update fstab
      '  UUID=$(blkid -s UUID -o value $DATA_DEVICE)',
      `  echo "UUID=$UUID ${gitlabMountPoint} ext4 defaults,nofail,noatime 0 2" | tee -a /etc/fstab`,
      
      // Mount and set permissions
      `  mount ${gitlabMountPoint}`,
      '  chown git:git ${gitlabMountPoint}',
      '  chmod 755 ${gitlabMountPoint}',
      'else',
      '  echo "ERROR: EBS volume not found! Using root volume"',
      `  mkdir -p ${gitlabMountPoint}`,
      'fi',
    
      // GitLab installation continues...
      'echo "--- Installing Dependencies & Setting up GitLab Repo ---"',
      'export DEBIAN_FRONTEND=noninteractive',
      'apt-get update -y',
      'apt-get install -y curl ca-certificates tzdata perl',
      'curl -L https://packages.gitlab.com/install/repositories/gitlab/gitlab-ce/script.deb.sh | bash',
      'apt-get clean',
      
      'echo "--- Starting GitLab CE Installation ---"',
      'PUBLIC_IP=$(curl -s http://169.254.169.254/latest/meta-data/public-ipv4 || echo "127.0.0.1")',
      `EXTERNAL_URL="http://$PUBLIC_IP" apt-get install -y gitlab-ce`,
      
      'echo "--- Post-Install Configuration ---"',
      'gitlab-ctl reconfigure'
    );
    
    

    const ubuntuAmi = ec2.MachineImage.lookup({
      name: 'ubuntu/images/hvm-ssd/ubuntu-jammy-22.04-amd64-server-*',
      owners: ['099720109477'],
    });

    const instance = new ec2.Instance(this, 'GitLabInstance', {
      vpc: vpc,
      instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.LARGE),
      machineImage: ubuntuAmi,
      securityGroup: gitlabSecurityGroup,
      role: instanceRole,
      vpcSubnets: { subnetType: ec2.SubnetType.PUBLIC },
      blockDevices: [rootBlockDevice, dataBlockDevice],
      userData: userData,
    });

    // --- Elastic IP --- START ADDITION ---
    // Allocate an Elastic IP address
    const elasticIp = new ec2.CfnEIP(this, 'GitLabEIP');

    // Associate the Elastic IP with the EC2 instance using AllocationId
    new ec2.CfnEIPAssociation(this, 'GitLabEIPAssociation', {
        allocationId: elasticIp.attrAllocationId, // <-- Use AllocationId attribute
        instanceId: instance.instanceId,
    });
    // --- Elastic IP --- END ADDITION ---

    // --- Outputs ---
    // Output the Elastic IP address instead of the dynamic public IP
    new cdk.CfnOutput(this, 'GitLabInstancePublicIp', { // Keep the Output name the same for consistency
      value: elasticIp.ref, // Output the EIP address
      description: 'Static Public IP (Elastic IP) of the GitLab EC2 instance',
    });
    new cdk.CfnOutput(this, 'SsmCommand', {
      value: `aws ssm start-session --target ${instance.instanceId}`,
      description: 'Command to connect via SSM Session Manager',
    });
  }
}