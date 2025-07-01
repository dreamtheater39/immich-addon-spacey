#!/bin/bash
set -e

DOCKER_USER="skowdley"
BACKEND_IMAGE="$DOCKER_USER/immich-addon-spacey-backend:latest"
FRONTEND_IMAGE="$DOCKER_USER/immich-addon-spacey-frontend:latest"

docker login

echo "Building and pushing backend..."
docker build -t $BACKEND_IMAGE ./backend
docker push $BACKEND_IMAGE

echo "Building and pushing frontend..."
docker build -t $FRONTEND_IMAGE ./frontend
docker push $FRONTEND_IMAGE

echo "Docker images published successfully!"
