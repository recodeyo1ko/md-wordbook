FROM node:22-alpine
WORKDIR /usr/src/app/front

RUN npm install -g next

# COPY package.json yarn.lock ./
# RUN npm install

COPY . .

CMD [ "npm", "run", "dev" ]