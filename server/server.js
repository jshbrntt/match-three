const io = require('socket.io')();
let sockets = [];
io.on('connection', (socket) => {
  console.log(`${socket.id} Connected`);
  sockets.push(socket);
  socket.broadcast.emit('connected', sockets.map(socket => socket.id));
  socket.on('disconnect', function(){
    console.log(`${socket.id} Disconnected`);
    sockets.splice(sockets.indexOf(socket), 1);
  });
  socket.on('swap', data => {
    console.log(`${data} Swapped`);
    socket.broadcast.emit('swap', data);
  });
});
io.listen(3000);
console.log('http://0.0.0.0:3000');
