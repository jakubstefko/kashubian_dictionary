FROM node:18-alpine
WORKDIR /app
ENV PATH /app/node_modules/.bin:$PATH
COPY package.json ./
COPY package-lock.json ./
RUN npm install --silent
COPY . ./
ENTRYPOINT ["npm", "run", "build"]
ENTRYPOINT ["npm", "run", "start"]
EXPOSE 3000
