FROM node:18.1-alpine as development

RUN npm install -g @nestjs/cli@8.0.0

WORKDIR /home/node/app

# RUN chmod 740 -R .

# USER node

FROM development as pre-build

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM node:18.1-alpine as production

ARG NODE_ENV=production
ENV NODE_ENV=${NODE_ENV}

WORKDIR /home/node/app

COPY package*.json ./

RUN npm install --only=production

COPY --from=pre-build /home/node/app/dist ./dist

CMD ["node", "dist/main"]