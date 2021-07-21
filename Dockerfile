# Stage 1 building the code
FROM node:lts-slim as builder
WORKDIR /usr/app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Stage 2 final stage with builded code
FROM node:lts-slim
WORKDIR /usr/app
COPY package*.json ormconfig.js ./
RUN npm ci --production

VOLUME /usr/app/upload
VOLUME /usr/app/logs

COPY --from=builder /usr/app/dist ./dist
COPY ./media ./media

ENV JWT_SECRET ='mon-token-secret' \
    DB_TYPE='mariadb' \
    DB_HOST='localhost' \
    DB_PORT=3306 \
    DB_DATABASE='dbname' \
    DB_USER='user' \
    DB_PASSWORD='' \
    PORT=3000 \
    LOG_LEVEL='debug' \
    ENDPOINT_PREFIX='' \
    NODE_ENV='production'\
    SENDGRID_API_KEY=''\
    SENDGRID_SEND_EMAIL=''\
    SENDGRID_REPLY_EMAIL=''\
    RECAPTCHA_KEY=''


EXPOSE 3000
CMD node dist/app.js
