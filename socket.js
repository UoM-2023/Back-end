const { Server } = require('http');
const { Server: SocketServer } = require('socket.io');

class SocketIo {
  constructor() {
    this.io = null;
  }

  init(server) {
    const onlineUsers = [];

    this.io = new SocketServer(server, {
      cors: {
        origin: '*',
      },
    });

    this.io.on('connection', (socket) => {
      // const userAuthObject = socket.handshake.auth;
      // const socketUserId = userAuthObject ? parseInt(userAuthObject.userId) : null;
      // console.log('a user connected with id: ', socketUserId);
      
      // if (userAuthObject && socketUserId) {
      //   onlineUsers.push(socketUserId);
      //   socket.on('init', () => {
      //     socket.emit('onlineUsers', onlineUsers);
      //   });
      //   this.updateUserStatus(socketUserId, true);
      // }

      socket.on('reservationcount', (data) => {
        console.log('Starting ' + data);
        socket.broadcast.emit('reservationcount', data); // Corrected usage here
      });

      // socket.on('disconnect', () => {
      //   console.log('user disconnected: ', socketUserId);
      //   if (userAuthObject && socketUserId) {
      //     onlineUsers.splice(onlineUsers.indexOf(socketUserId), 1);
      //     socket.broadcast.emit('userStatus', {
      //       userId: socketUserId,
      //       isOnline: false,
      //     });
      //     this.updateUserStatus(socketUserId, false);
      //   }
      // });


      socket.on('disconnect', () => {
        console.log('User disconnected');
      });

    });
//     this.io.on('ReservationCount', (data) => {
//       console.log('Server received ReservationCount: ' + data);
//       this.io.emit('ReservationCount', data); // Emit to all clients
//     });
  }

  // updateUserStatus(userId, isOnline) {
  //   // Implement your updateUserStatus logic here
  // }

  ReservationCount(data) {
    if (this.io) {
      console.log('Running ' + data);
      this.io.emit('reservationcount', data);
    } else {
      console.error('Socket.io is not initialized');
    }
  }
}

const socketIo = new SocketIo();
module.exports = { socketIo };