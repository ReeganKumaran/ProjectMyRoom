const MyIOTDevice = require("../models/MyIOTDevice");
const bcrypt = require("bcrypt");
const logger = require("../utils/logger");

module.exports = async (req, res, next) => {
  try {
    // 1. Check if "esp-secret-123" is used (Legacy/Fallback)
    const token = req.headers["x-auth-token"] || req.query.token;
    if (token === "esp-secret-123") {
      return next();
    }

    // 2. Check for Device Credentials in Headers
    const deviceId = req.headers["x-device-id"] || req.query.deviceId;
    const password = req.headers["x-device-password"] || req.query.password;

    if (!deviceId || !password) {
      return res.status(401).json({
        message:
          "Access Denied: Missing Credentials (x-device-id, x-device-password)",
        status: "error",
        timestamp: new Date(),
      });
    }

    // 3. Validate against Database
    const device = await MyIOTDevice.findOne({ deviceID: deviceId });
    if (!device) {
      logger.warn(`API Auth Failed: Device not found - ${deviceId}`);
      return res.status(401).json({
        message: "Access Denied: Invalid Device ID",
        status: "error",
        timestamp: new Date(),
      });
    }

    const match = await bcrypt.compare(password, device.devicePassword);
    if (!match) {
      logger.warn(`API Auth Failed: Invalid Password - ${deviceId}`);
      return res.status(401).json({
        message: "Access Denied: Invalid Password",
        status: "error",
        timestamp: new Date(),
      });
    }

    // Auth Successful
    req.device = device;
    next();
  } catch (error) {
    logger.error(`API Auth Middleware Error: ${error.message}`);
    return res.status(500).json({
      message: "Internal Server Error",
      status: "error",
      timestamp: new Date(),
    });
  }
};
