const mongoose = require('mongoose');

const sensorSchema = new mongoose.Schema(
  {
    deviceId: {
      type: String,
      required: true,
      index: true
    },

    ax: {
      type: Number,
      required: true
    },

    ay: {
      type: Number,
      required: true
    },

    az: {
      type: Number,
      required: true
    },

    gx: {
      type: Number,
      required: true
    },

    gy: {
      type: Number,
      required: true
    },

    gz: {
      type: Number,
      required: true
    },

    A: {
      type: Number,
      required: true
    },

    fall: {
      type: Boolean,
      required: true
    }
  },
  {
    timestamps: true  // automatically creates createdAt & updatedAt
  }
);

module.exports = mongoose.model('SensorData', sensorSchema);
