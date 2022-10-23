FROM node:14-alpine
WORKDIR /workspace
COPY . .
RUN npm i --legacy-peer-deps
ENV NODE_ENV=production
CMD ["node", "bin/www"]
