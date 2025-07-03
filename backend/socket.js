const { Server } = require('socket.io');
const jwt = require('jsonwebtoken');
const Message = require('./models/Message');
const DisputeThread = require('./models/DisputeThread');
const User = require('./models/User');

function setupSocket(server) {
  const io = new Server(server, {
    cors: { origin: '*' }
  });

  io.use(async (socket, next) => {
    const token = socket.handshake.auth.token;
    if (!token) return next(new Error('No token'));
    try {
      const user = jwt.verify(token, process.env.JWT_SECRET);
      socket.user = user;
      next();
    } catch (err) {
      next(new Error('Invalid token'));
    }
  });

  io.on('connection', (socket) => {
    socket.on('join-thread', (threadId) => {
      socket.join(threadId);
    });

    socket.on('send-message', async ({ threadId, content }) => {
      if (!threadId || !content) return;
      const message = new Message({
        thread: threadId,
        sender: socket.user.id,
        content
      });
      await message.save();
      io.to(threadId).emit('receive-message', {
        threadId,
        sender: socket.user,
        content,
        timestamp: message.timestamp
      });
    });
  });
}

module.exports = setupSocket; 