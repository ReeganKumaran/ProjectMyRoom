const mongoose = require("mongoose");

const MyRoomDeviceSchema = new mongoose.Schema({
  deviceID: {
    type: String,
    unique: true,
  },
  deviceType: {
    type: String,
    enum: [
      "Light",
      "Fan",
      "Blind",
      "Temperature",
      "Humidity",
      "Motion",
      "Door",
      "Window",
    ],
    required: true,
  },
  deviceStatus: {
    type: Boolean,
    default: false,
  },
  deviceName: {
    type: String,
  },
  parentIOTDeviceId: {
    type: String,
    ref: "MyIOTDevice",
  },
});

MyRoomDeviceSchema.pre("validate", async function () {
  if (!this.deviceID) {
    try {
      const count = await mongoose.model("MyRoomDevice").countDocuments();
      this.deviceID = `Device-${count + 1}`;
    } catch (error) {
      throw error;
    }
  }
});

module.exports = mongoose.model("MyRoomDevice", MyRoomDeviceSchema);
