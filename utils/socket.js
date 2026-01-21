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

    io.use(async (socket, next) => {
      const { token, deviceId, password } = socket.handshake.query;

      // 1. ESP Device Authentication using DB
      if (deviceId && password) {
        try {
          const MyIOTDevice = require("../models/MyIOTDevice");
          const bcrypt = require("bcrypt");
          const device = await MyIOTDevice.findOne({ deviceID: deviceId });

          if (device) {
            if (!password || !device.devicePassword) {
              console.log(`Missing credentials for device: ${deviceId}`);
              return next(
                new Error("Authentication Error: Invalid Credentials"),
              );
            }

            const match = await bcrypt.compare(password, device.devicePassword);
            if (match) {
              console.log(`Device authenticated: ${deviceId}`);
              socket.device = device; // Attach device info to socket
              return next();
            }
          }

          console.log(`Authentication failed for device: ${deviceId}`);
          return next(new Error("Authentication Error: Invalid Credentials"));
        } catch (err) {
          const logger = require("./logger");
          logger.error("Socket Auth Error: " + err.message);
          return next(new Error("Authentication Error: Server Internal Error"));
        }
      }

      // 2. Legacy/Simple Token Auth
      if (token === "esp-secret-123") {
        // allow ESP
        return next();
      }

      // 3. Strict Denial for Unauthenticated Users
      // If we reach here, it means:
      // - No valid deviceId/password combo was provided
      // - No valid token was provided
      // So we must REJECT the connection.

      const logger = require("./logger");
      logger.error(
        `Socket connection rejected: No credentials provided from ${socket.handshake.address}`,
      );
      return next(
        new Error(
          "Authentication Error: Access Denied. Please provide valid credentials.",
        ),
      );
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
