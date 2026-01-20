const express = require("express");
const cors = require("cors");
require("dotenv").config();
const morgan = require("morgan");
const logger = require("./utils/logger");
const connectDB = require("./config/db");
const homeRoutes = require("./routes/homeRoutes");

const app = express();
const http = require("http");
const server = http.createServer(app);
const socket = require("./utils/socket");
const io = socket.init(server);

const PORT = process.env.PORT || 3000;

connectDB();

io.on("connection", (socket) => {
  logger.info("Client connected to WebSocket");
  socket.on("disconnect", () =>
    logger.info("Client disconnected from WebSocket"),
  );
});

// Middleware
app.use(cors());
app.use(express.json());

// Use morgan for HTTP request logging, piping to winston
app.use(
  morgan("combined", {
    stream: { write: (message) => logger.info(message.trim()) },
  }),
);

// Routes
app.use("/api", homeRoutes);

// Base route for health check
app.get("/", (req, res) => {
  res.send("API is running. Check /api for main endpoints.");
});

// Start server
server.listen(PORT, "0.0.0.0", () => {
  console.log(`Server is running on port ${PORT}`);
});
