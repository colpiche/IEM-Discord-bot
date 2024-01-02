#!/bin/sh

CONTAINER="iem-discord-bot"

docker stop $CONTAINER
docker rm $CONTAINER
docker rmi $CONTAINER
git pull
docker build . -t $CONTAINER:latest
docker run -d --name $CONTAINER $CONTAINER:latest
