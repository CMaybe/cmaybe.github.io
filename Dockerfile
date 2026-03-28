FROM node:lts

WORKDIR /workspace

EXPOSE 3000

CMD ["npm", "start", "--", "--host", "0.0.0.0"]