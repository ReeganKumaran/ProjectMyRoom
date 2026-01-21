const mongoose = require("mongoose");

const MyIOTDeviceSchema = new mongoose.Schema({
  deviceID: {
    type: String,
    unique: true,
  },
  deviceType: {
    type: String,
    enum: ["Admin", "Controller"],
    default: "Controller",
  },
  devicePassword: {
    type: String,
    required: true,
  },
  deviceName: {
    type: String,
    required: true,
  },
  deviceLocation: {
    type: String,
  },
  deviceStatus: {
    type: String,
  },
});

MyIOTDeviceSchema.pre("validate", async function () {
  if (!this.deviceID) {
    try {
      const count = await mongoose.model("MyIOTDevice").countDocuments();
      this.deviceID = `Device-${count + 1}`;
    } catch (error) {
      throw error;
    }
  }
});

MyIOTDeviceSchema.pre("save", async function () {
  if (!this.isModified("devicePassword")) {
    return;
  }
  try {
    const bcrypt = require("bcrypt");
    const salt = await bcrypt.genSalt(10);
    this.devicePassword = await bcrypt.hash(this.devicePassword, salt);
  } catch (err) {
    throw err;
  }
});

module.exports = mongoose.model("MyIOTDevice", MyIOTDeviceSchema);
