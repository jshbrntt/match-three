const IcosaEvent = require('./icosa-event')
const io = require('socket.io')
const process = require('process')

const SocketIOEvent = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  DISCONNECTING: 'disconnecting',
  ERROR: 'error'
}

class IcosaServer {
  constructor (port) {
    this.sockets = new Map()
    this.server = io()
    this.server.on(SocketIOEvent.CONNECT, this.handleConnect.bind(this))
    this.server.listen(port)
  }
  handleConnect (socket) {
    console.log(`${socket.id} Connect`)
    this.sockets.set(socket.id, socket)
    socket.broadcast.emit(IcosaEvent.CONNECT, socket.id)
    socket.on(SocketIOEvent.DISCONNECT, this.handleDisconnect.bind(this, socket))
    socket.on(SocketIOEvent.DISCONNECTING, this.handleDisconnecting.bind(this, socket))
    socket.on(IcosaEvent.SIGN_IN, this.handleSignIn.bind(this, socket))
    socket.on(IcosaEvent.SWAP, this.handleSwap.bind(this, socket))
  }
  handleDisconnecting (socket) {
    console.log(`${socket.id} Disconnecting`)
  }
  handleDisconnect (socket) {
    console.log(`${socket.id} Disconnect`)
    if (this.sockets.has(socket.id)) {
      socket.broadcast.emit(IcosaEvent.SIGN_OUT, this.sockets.get(socket.id).profile)
    }
    this.sockets.delete(socket.id)
  }
  handleSwap (socket, move) {
    console.log(`${socket.id} Swap`)
    socket.broadcast.emit(IcosaEvent.SWAP, move)
  }
  handleSignIn (socket, profile) {
    console.log(`${socket.id} SignIn`)
    socket.broadcast.emit(IcosaEvent.SIGN_IN, profile)
  }
}

module.exports = IcosaServer
