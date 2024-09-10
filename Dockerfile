FROM node:22-alpine3.19

WORKDIR /app

COPY package.json .

RUN yarn

COPY . .

EXPOSE 3000

# ENV PORT=3000
# ENV DB_URL=sqlserver://
# ENV API_KEY=your_api_key_here
# ENV ENCRYPTION_HASH=your_encryption_hash_here

CMD ["yarn", "start"]
