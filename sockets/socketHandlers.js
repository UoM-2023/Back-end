// sockets/socketHandlers.js
module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('New client connected');

        socket.on('disconnect', () => {
            console.log('Client disconnected');
        });

        // Handle new complaint event
    socket.on('newComplaint', (complaint) => {
        console.log('New complaint received:', complaint);
        io.emit('receiveNotification', complaint); // Broadcast to all clients
      });
    });
  };
