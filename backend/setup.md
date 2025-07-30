# ADIF File Visualizer - EC2 Deployment Guide

Simple guide to deploy the ADIF File Visualizer on EC2.

## Prerequisites
- Docker installed locally
- Docker Hub account
- EC2 instance with SSH access

---

## Step 1: Build and Push Docker Image

### Build the Docker Image
```bash
# Navigate to backend directory
cd backend

# Enable Docker BuildKit for faster builds
export DOCKER_BUILDKIT=1

# Build for AMD64 architecture (compatible with most servers)
docker build --platform linux/amd64 -t sidutta/adif-file-visualizer-assignment-server:v1 .

# Tag for Docker Hub
docker tag sidutta/adif-file-visualizer-assignment-server:v1 sidutta/adif-file-visualizer-assignment-server:latest
```

### Push to Docker Hub
```bash
# Login to Docker Hub
docker login

# Push the image
docker push sidutta/adif-file-visualizer-assignment-server:v1
docker push sidutta/adif-file-visualizer-assignment-server:latest
```

---

## Step 2: Deploy on EC2

### Connect to EC2
```bash
ssh -i "adif-key-pair.pem" ubuntu@ec2-184-73-83-38.compute-1.amazonaws.com
```

### Install Docker on EC2
```bash
sudo apt update
sudo apt install -y docker.io
sudo systemctl start docker
sudo systemctl enable docker
sudo usermod -aG docker ubuntu
```

**Reconnect to EC2 after adding user to docker group:**
```bash
exit
ssh -i "adif-key-pair.pem" ubuntu@ec2-184-73-83-38.compute-1.amazonaws.com
```

### Pull and Run the Application
```bash
# Pull your image
docker pull sidutta/adif-file-visualizer-assignment-server:v1

# Run the container
docker run -d -p 80:8080 --name adif-visualizer sidutta/adif-file-visualizer-assignment-server:v1
```

### Verify Deployment
```bash
# Check if container is running
docker ps

# Test the application
curl http://localhost:80
```

---

## Step 3: Access the Application

Open your browser and navigate to:
```
http://ec2-184-73-83-38.compute-1.amazonaws.com
```

The application will be accessible on port 80.

---

## Troubleshooting

### Check Container Logs
```bash
docker logs adif-visualizer
```

### Restart Container
```bash
docker restart adif-visualizer
```

### Remove and Recreate Container
```bash
docker stop adif-visualizer
docker rm adif-visualizer
docker run -d -p 80:8080 --name adif-visualizer sidutta/adif-file-visualizer-assignment-server:v1
```

---

## Quick Commands Reference

| Action | Command |
|--------|---------|
| Build Image | `docker build --platform linux/amd64 -t sidutta/adif-file-visualizer-assignment-server:v1 .` |
| Push to Hub | `docker push sidutta/adif-file-visualizer-assignment-server:v1` |
| Pull on EC2 | `docker pull sidutta/adif-file-visualizer-assignment-server:v1` |
| Run Container | `docker run -d -p 80:8080 --name adif-visualizer sidutta/adif-file-visualizer-assignment-server:v1` |
| Check Status | `docker ps` |
| View Logs | `docker logs adif-visualizer` |