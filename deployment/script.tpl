#! /bin/bash
sleep 120
yum update -y
yum install git wget ruby -y
yum install -y yum-utils device-mapper-persistent-data lvm2
yum-config-manager — add-repo https://download.docker.com/linux/centos/docker-ce.repo
yum install docker -y
yum install docker-compose -y

curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.34.0/install.sh | bash
. ~/.nvm/nvm.sh
nvm install node

# wget https://aws-codedeploy-ap-southeast-1.s3.ap-southeast-1.amazonaws.com/latest/install
wget https://aws-codedeploy-us-east-1.s3.ap-southeast-1.amazonaws.com/latest/install

chmod +x ./install
./install auto
service codedeploy-agent start
wget https://s3.amazonaws.com/aaronsilber/public/authbind-2.1.1-0.1.x86_64.rpm
rpm -Uvh https://s3.amazonaws.com/aaronsilber/public/authbind-2.1.1-0.1.x86_64.rpm
touch /etc/authbind/byport/80
chmod 500 /etc/authbind/byport/80
chown ec2-user /etc/authbind/byport/80
git clone https://github.com/rash3ye/slboty.git /home/ec2-user/app
chmod +x /home/ec2-user/app/scripts/*
/home/ec2-user/app/scripts/install_app_dependencies
/home/ec2-user/app/scripts/start_server