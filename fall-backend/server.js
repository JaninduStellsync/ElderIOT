require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const mqtt = require('mqtt');

const app = express();
app.use(express.json());

// ================== MONGODB CONNECTION ==================
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB Connected"))
  .catch(err => console.error("❌ MongoDB Error:", err));

// ================== SCHEMA ==================
const sensorSchema = new mongoose.Schema(
  {
    deviceId: { type: String, required: true, index: true },
    ax: Number,
    ay: Number,
    az: Number,
    gx: Number,
    gy: Number,
    gz: Number,
    A: Number,
    fall: Boolean
  },
  { timestamps: true }
);

const SensorData = mongoose.model("SensorData", sensorSchema);

// ================== MQTT CONNECTION ==================
const client = mqtt.connect(process.env.MQTT_URL, {
  username: process.env.MQTT_USER,
  password: process.env.MQTT_PASS,
  reconnectPeriod: 5000
});

client.on('connect', () => {
  console.log("✅ Connected to HiveMQ");
  client.subscribe('fall/device01/data', (err) => {
    if (err) {
      console.error("❌ MQTT Subscribe Error:", err);
    } else {
      console.log("📡 Subscribed to topic: fall/device01/data");
    }
  });
});

client.on('reconnect', () => {
  console.log("🔄 Reconnecting to MQTT...");
});

client.on('error', (err) => {
  console.error("❌ MQTT Error:", err);
});

// ================== MQTT MESSAGE HANDLER ==================
client.on('message', async (topic, message) => {
  try {
    const raw = message.toString();

    console.log("\n📥 MQTT MESSAGE RECEIVED");
    console.log("Topic:", topic);
    console.log("Raw Payload:", raw);

    const data = JSON.parse(raw);

    if (!data.deviceId) {
      console.log("⚠ Missing deviceId. Skipping save.");
      return;
    }

    console.log("Device ID:", data.deviceId);
    console.log("Acceleration (A):", data.A);
    console.log("Fall Status:", data.fall);
    console.log("Time:", new Date().toLocaleString());

    const savedDoc = await SensorData.create(data);

    console.log("💾 Saved to MongoDB with ID:", savedDoc._id);

    if (data.fall === true) {
      console.log("🚨🚨 FALL EVENT STORED IMMEDIATELY 🚨🚨");
    } else {
      console.log("Normal data stored.");
    }

  } catch (err) {
    console.error("❌ Error Processing MQTT Message:", err);
  }
});

// ================== API ROUTES ==================

// Health check
app.get('/', (req, res) => {
  res.send("Fall Detection Backend Running");
});

// Get latest 50 records
app.get('/data', async (req, res) => {
  try {
    const records = await SensorData.find()
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get by device
app.get('/device/:id', async (req, res) => {
  try {
    const records = await SensorData.find({ deviceId: req.params.id })
      .sort({ createdAt: -1 })
      .limit(50);
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// Get only fall events
app.get('/falls', async (req, res) => {
  try {
    const records = await SensorData.find({ fall: true })
      .sort({ createdAt: -1 });
    res.json(records);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
});

// ================== START SERVER ==================
app.listen(5000, () => {
  console.log("🚀 Server running on port 5000");
});
