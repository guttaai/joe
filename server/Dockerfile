FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

# Install ts-node globally
RUN npm install -g ts-node typescript

# Install project dependencies
RUN npm install

COPY . .

EXPOSE 2049 2050

CMD ["npm", "run", "start"] 