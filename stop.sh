#!/bin/bash

# Exit on any error
set -e

CONTAINER_NAME="spacey_backend"

echo "Stopping container: $CONTAINER_NAME"
docker stop "$CONTAINER_NAME" || echo "Container $CONTAINER_NAME is not running."

echo "Removing container: $CONTAINER_NAME"
docker rm "$CONTAINER_NAME" || echo "Container $CONTAINER_NAME does not exist."

echo "Pruning unused Docker containers, networks, volumes, and images..."
docker system prune -a --volumes -f


CONTAINER_NAME="spacey_frontend"

echo "Stopping container: $CONTAINER_NAME"
docker stop "$CONTAINER_NAME" || echo "Container $CONTAINER_NAME is not running."

echo "Removing container: $CONTAINER_NAME"
docker rm "$CONTAINER_NAME" || echo "Container $CONTAINER_NAME does not exist."

echo "Pruning unused Docker containers, networks, volumes, and images..."
docker system prune -a --volumes -f

echo "Cleanup completed."
