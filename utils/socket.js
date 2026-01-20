let io;

module.exports = {
  init: (httpServer) => {
    const { Server } = require("socket.io");
    io = new Server(httpServer, {
      allowEIO3: true,
      transports: ["websocket", "polling"],
      cors: {
        origin: "*",
        methods: ["GET", "POST"],
      },
    });

    io.use((socket, next) => {
      const token = socket.handshake.query.token;

      if (token === "esp-secret-123") {
        // allow ESP
        return next();
      }

      // normal JWT verification for web users...
      // TODO: Implement actual JWT verification here
      // For now, we allow connection to proceed (or you can throw error if strict)
      next();
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error("Socket.io not initialized!");
    }
    return io;
  },
};
