const io = require('socket.io')();
let sockets = {};

function startServer() {
  io.on('connection', (socket) => {
    console.log(`${socket.id} Connected`);
    Object.keys(sockets).map(id => {
      let socket = sockets[id];
      if (socket.hasOwnProperty('profile')) {
        socket.socket.broadcast.emit('signin', socket.profile);
      }
    });
    sockets[socket.id] = { socket: socket };
    socket.on('disconnect', function () {
      console.log(`${socket.id} Disconnected`);
      if (sockets[socket.id].hasOwnProperty('profile')) {
        socket.broadcast.emit('signout', sockets[socket.id].profile);
      }
      delete sockets[socket.id];
    });
    socket.on('swap', data => {
      console.log(`${data} Swapped`);
      socket.broadcast.emit('swap', data);
    });
    socket.on('signin', profile => {
      console.log(`${profile} Signed In`);
      sockets[socket.id].profile = profile;
      socket.broadcast.emit('signin', profile);
    });
  });
  io.listen(3000);
}

module.exports = {
  startServer,
};
