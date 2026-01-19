const MyRoomDevice = require("../models/MyRoomDevice");
const MyIOTDevice = require("../models/MyIOTDevice");

exports.getHome = (req, res) => {
  res.json({
    message: "Welcome to ProjectMyRoom API",
    status: "success",
    timestamp: new Date(),
  });
};

exports.getStatus = (req, res) => {
  res.json({
    message: "API is running. Check /api for main endpoints.",
    status: "success",
    timestamp: new Date(),
  });
};

exports.listIOTDevice = async (req, res) => {
  try {
    const devices = await MyIOTDevice.find();
    res.json({
      message: "Devices listed successfully",
      data: devices,
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: "Failed to list devices",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.addIOTDevice = async (req, res) => {
  try {
    const { deviceName, deviceLocation, deviceStatus } = req.body;
    const device = new MyIOTDevice({
      deviceName,
      deviceLocation,
      deviceStatus,
    });
    await device.save();
    try {
      require("../utils/socket")
        .getIO()
        .emit("iot_device_update", { action: "add", device });
    } catch (e) {
      console.error("Socket emit failed", e);
    }
    res.json({
      message: "Device added successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    require("../utils/logger").error(
      "Error adding IOT Device: " + error.message,
    );
    res.json({
      message: "Failed to add device",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.editIOTDevice = async (req, res) => {
  try {
    const { deviceID, deviceName, deviceLocation, deviceStatus } = req.body;
    const device = await MyIOTDevice.findOne({ deviceID });
    if (!device) {
      return res.json({
        message: "Device not found",
        status: "error",
        timestamp: new Date(),
      });
    }
    device.deviceName = deviceName;
    device.deviceLocation = deviceLocation;
    device.deviceStatus = deviceStatus;
    await device.save();
    try {
      require("../utils/socket")
        .getIO()
        .emit("iot_device_update", { action: "update", device });
    } catch (e) {
      console.error("Socket emit failed", e);
    }
    res.json({
      message: "Device edited successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: "Failed to edit device",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.deleteIOTDevice = async (req, res) => {
  try {
    const { deviceID } = req.body;
    const device = await MyIOTDevice.findOne({ deviceID });
    if (!device) {
      return res.json({
        message: "Device not found",
        status: "error",
        timestamp: new Date(),
      });
    }
    await device.remove();
    try {
      require("../utils/socket")
        .getIO()
        .emit("iot_device_update", { action: "delete", deviceID });
    } catch (e) {
      console.error("Socket emit failed", e);
    }
    res.json({
      message: "Device deleted successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error in deleteDevice:", error);
    res.json({
      message: "Failed to delete device",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.listDevice = async (req, res) => {
  try {
    const devices = await MyRoomDevice.find();
    res.json({
      message: "Devices listed successfully",
      data: devices,
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: "Failed to list devices",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.addDevice = async (req, res) => {
  try {
    const { deviceType, deviceStatus, deviceName, parentIOTDeviceId } =
      req.body;
    const device = new MyRoomDevice({
      deviceType,
      deviceStatus,
      deviceName,
      parentIOTDeviceId,
    });
    await device.save();
    try {
      require("../utils/socket")
        .getIO()
        .emit("room_device_update", { action: "add", device });
    } catch (e) {
      console.error("Socket emit failed", e);
    }
    res.json({
      message: "Device added successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: "Failed to add device",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.changeDeviceStatus = async (req, res) => {
  try {
    const { deviceID, deviceStatus } = req.body;
    const device = await MyRoomDevice.findOne({ deviceID });
    if (!device) {
      return res.json({
        message: "Device not found",
        status: "error",
        timestamp: new Date(),
      });
    }
    device.deviceStatus = deviceStatus;
    await device.save();
    try {
      require("../utils/socket")
        .getIO()
        .emit("room_device_update", { action: "update", device });
    } catch (e) {
      require("../utils/logger").error("Socket emit failed: " + e.message);
    }
    res.json({
      message: "Device status changed successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: "Failed to change device status",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.editDevice = async (req, res) => {
  try {
    const { deviceID, deviceType, deviceStatus, deviceName } = req.body;
    const device = await MyRoomDevice.findOne({ deviceID });
    if (!device) {
      return res.json({
        message: "Device not found",
        status: "error",
        timestamp: new Date(),
      });
    }
    device.deviceType = deviceType;
    device.deviceStatus = deviceStatus;
    device.deviceName = deviceName;
    await device.save();
    try {
      require("../utils/socket")
        .getIO()
        .emit("room_device_update", { action: "update", device });
    } catch (e) {
      console.error("Socket emit failed", e);
    }
    res.json({
      message: "Device edited successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      message: "Failed to edit device",
      status: "error",
      timestamp: new Date(),
    });
  }
};

exports.deleteDevice = async (req, res) => {
  try {
    const { deviceID } = req.body;
    const device = await MyRoomDevice.findOne({ deviceID });
    if (!device) {
      return res.json({
        message: "Device not found",
        status: "error",
        timestamp: new Date(),
      });
    }
    await device.remove();
    try {
      require("../utils/socket")
        .getIO()
        .emit("room_device_update", { action: "delete", deviceID });
    } catch (e) {
      console.error("Socket emit failed", e);
    }
    res.json({
      message: "Device deleted successfully",
      status: "success",
      timestamp: new Date(),
    });
  } catch (error) {
    console.error("Error in deleteDevice:", error);
    res.json({
      message: "Failed to delete device",
      status: "error",
      timestamp: new Date(),
    });
  }
};
