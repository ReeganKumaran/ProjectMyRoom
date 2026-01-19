const mongoose = require("mongoose");

const MyIOTDeviceSchema = new mongoose.Schema({
  deviceID: {
    type: String,
    unique: true,
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
module.exports = mongoose.model("MyIOTDevice", MyIOTDeviceSchema);
