FROM ubuntu:14.04

RUN apt-get update; apt-get install -y apt-transport-https; echo deb https://deb.nodesource.com/node_4.x trusty main >> /etc/apt/sources.list
RUN apt-get update; apt-get install -y --force-yes nodejs git ssh-client python make g++ libkrb5-dev git wget

RUN npm cache clean -f; npm install -g n; n stable

RUN mkdir -p /root/app

RUN npm install -g bower gulp

COPY ./root/app/package.json /root/app
RUN cd /root/app; npm update;

COPY ./root/app/bower.json /root/app
RUN cd /root/app; bower update --allow-root

COPY . /

RUN chmod +x /run_app.sh

ENV HOSTNAME=app
ENV PROJECT=ecoluiton
EXPOSE 8100

CMD /run_app.sh
