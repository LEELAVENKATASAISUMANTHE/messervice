FROM node:20-alpine

WORKDIR /app

COPY ["Eligibility Service/package.json", "Eligibility Service/package-lock.json", "./"]

RUN npm install --omit=dev

COPY ["Eligibility Service/", "./"]

EXPOSE 5789

CMD ["node", "index.js"]

