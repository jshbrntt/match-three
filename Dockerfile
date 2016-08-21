FROM node:6.4.0
EXPOSE 80 8080 443
ADD . /match-three
WORKDIR /match-three
RUN npm install
CMD npm run watch
