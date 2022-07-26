# syntax=docker/dockerfile:1
# Uncomment and comment out Node to build postgres
# FROM postgres

# ARG CACHEBUST=1

# ENV POSTGRES_PASSWORD password
# ENV POSTGRES_USER postgres
# ENV POSTGRES_DB asn3_db
# COPY init-notes-db.sh /docker-entrypoint-initdb.d/

# Uncomment and comment out postgres to build Node
FROM node:12.18.1
ENV NODE_ENV=production

WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY . .

EXPOSE 3001

CMD [ "node", "server/server.js" ]