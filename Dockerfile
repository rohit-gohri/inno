FROM node:14-alpine
WORKDIR /workspace
COPY . .
RUN npm i --legacy-peer-deps
CMD ["node", "bin/www"]
