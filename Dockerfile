FROM node:14-alpine
WORKDIR /workspace
COPY . .
RUN npm i --legacy-peer-deps
ENV NODE_ENV=production
CMD ["npx", "pm2-runtime", "start", "ecosystem.config.js", "--env", "production"]
