FROM node:6.5.0
EXPOSE 80 3000
ADD . /match-three
WORKDIR /match-three
RUN npm install
RUN npm run build
CMD npm start
