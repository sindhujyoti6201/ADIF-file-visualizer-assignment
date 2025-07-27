# ADIF File Visualizer Setup Guide

This guide provides detailed instructions for setting up and running the ADIF File Visualizer application on an EC2 instance.

## Prerequisites

- Ubuntu EC2 instance with SSH access
- SSH key pair for EC2 access
- Basic familiarity with Docker and command line operations

## Table of Contents

1. [EC2 Instance Setup](#ec2-instance-setup)
2. [Docker Installation](#docker-installation)
3. [Application Deployment](#application-deployment)
4. [Testing the Application](#testing-the-application)
5. [Troubleshooting](#troubleshooting)
6. [Maintenance](#maintenance)

---

## EC2 Instance Setup

### Step 1: Connect to EC2 Instance
```bash
ssh -i "adif-key-pair.pem" ubuntu@ec2-184-73-83-38.compute-1.amazonaws.com
```

### Step 2: Update System Packages
```bash
sudo apt update
sudo apt upgrade -y
```

---

## Docker Installation

### Step 1: Install Docker
```bash
sudo apt install -y docker.io
```

### Step 2: Start and Enable Docker Service
```bash
sudo systemctl start docker
sudo systemctl enable docker
```

### Step 3: Add User to Docker Group
```bash
sudo usermod -aG docker ubuntu
```

### Step 4: Verify Docker Installation
```bash
docker --version
docker run hello-world
```

**Note**: After adding the user to the docker group, you may need to reconnect to the EC2 instance for the changes to take effect:
```bash
exit
ssh -i "adif-key-pair.pem" ubuntu@ec2-184-73-83-38.compute-1.amazonaws.com
```

### Step 5: Build and Push Docker Image
```bash
export DOCKER_BUILDKIT=1

docker build --platform linux/amd64 -t sidutta/adif-file-visualizer-assignment-server:v1 .

docker push sidutta/adif-file-visualizer-assignment-server:v1
```

**Commands Explained:**
- `export DOCKER_BUILDKIT=1`: Enable Docker BuildKit for faster builds
- `docker build --platform linux/amd64`: Build for AMD64 architecture (compatible with most servers)
- `-t sidutta/adif-file-visualizer-assignment-server:v1`: Tag the image with the specified name and version
- `docker push`: Push the built image to Docker Hub

---

## Application Deployment

### Step 1: Pull the Application Image
```bash
docker pull sidutta/adif-file-visualizer-assignment-server:v1
```

### Step 2: Run the Application Container
```bash
docker run -d -p 80:8080 --name adif-file-visualizer-assignment-server sidutta/adif-file-visualizer-assignment-server:v1
```

**Parameters Explained:**
- `-d`: Run container in detached mode (background)
- `-p 80:8080`: Map host port 80 to container port 8080
- `--name adif-file-visualizer-assignment-server`: Assign a name to the container for easy management

### Step 3: Verify Container Status
```bash
docker ps
```

### Step 4: Check Application Logs
```bash
docker logs adif-file-visualizer-assignment-server
```

---

## Testing the Application

### Step 1: Test Basic Connectivity
```bash
curl http://localhost:80
```

### Step 2: Test Upload Endpoint
```bash
# Test with a sample file
curl -X POST -F "file=@/path/to/your/file.txt" http://localhost:80/upload
```

### Step 3: Access via Web Browser
- Open your web browser
- Navigate to: `http://ec2-184-73-83-38.compute-1.amazonaws.com`
- The application should be accessible on port 80

