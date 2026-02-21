const mongoose = require("mongoose");

const careSchema = new mongoose.Schema({
  name: { type: String, required: true },
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  elderName: { type: String, required: true },
  deviceId: { type: String, required: true }
});

module.exports = mongoose.model("CareTable", careSchema);