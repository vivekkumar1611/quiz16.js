FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY quiz.js .
COPY public ./public

RUN addgroup -S appgroup && adduser -S appuser -G appgroup

USER appuser

EXPOSE 3000

CMD ["node", "quiz.js"]
