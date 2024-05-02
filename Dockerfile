## $ docker image build -t qqs-notificationsvcs -f Dockerfile .
## $ docker run --name notificationsvcs -d --network br0 --ip 192.168.5.7 -p 9080:9080 qqs-notificationsvcs:latest
## $ curl http://localhost:9080/health
## $
## $ docker tag qqs-notificationsvcs:latest ramalin/notificationsvcs:v1.0.0
## $ docker push ramalin/notificationsvcs:v1.0.0

###################
# BUILD FOR LOCAL DEVELOPMENT
###################

FROM --platform=linux/amd64 node:21-alpine As development
##FROM node:21-alpine As development
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node .npmrc ./
##COPY --chown=node:node .env ./
RUN npm i --force
COPY --chown=node:node . .
USER node

###################
# BUILD FOR PRODUCTION
###################

FROM --platform=linux/amd64 node:21-alpine As build
##FROM node:21-alpine As build
WORKDIR /usr/src/app
COPY --chown=node:node package*.json ./
COPY --chown=node:node --from=development /usr/src/app/node_modules ./node_modules
COPY --chown=node:node . .

RUN npm run build
ENV NODE_ENV production
RUN npm i --force --only=production && npm cache clean --force
USER node

###################
# PRODUCTION
###################

FROM --platform=linux/amd64 node:21-alpine As production
##FROM node:21-alpine As production

COPY --chown=node:node --from=build /usr/src/app/node_modules ./node_modules
COPY --chown=node:node --from=build /usr/src/app/dist ./dist
COPY --chown=node:node rkey.pem ./

CMD [ "node", "dist/main.js" ]
