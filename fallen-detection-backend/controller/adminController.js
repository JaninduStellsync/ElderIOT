const DeviceMaster = require("../model/DeviceMaster");
const CareTable = require("../model/CareTable");
const bcrypt = require("bcryptjs");

// ================= REGISTER DEVICE =================
exports.registerDevice = async (req, res) => {
  try {
    const { deviceId } = req.body;

    const existing = await DeviceMaster.findOne({ deviceId });
    if (existing) {
      return res.status(400).json({ message: "Device already exists" });
    }

    const device = new DeviceMaster({ deviceId });
    await device.save();

    res.json({ message: "Device Registered Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= CREATE CARETAKER (HASHED PASSWORD) =================
exports.createCaretaker = async (req, res) => {
  try {
    const { name, username, password, elderName, deviceId } = req.body;

    const userExists = await CareTable.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // 🔐 HASH PASSWORD
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const caretaker = new CareTable({
      name,
      username,
      password: hashedPassword,
      elderName,
      deviceId
    });

    await caretaker.save();

    res.json({ message: "Caretaker Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET DEVICES =================
exports.getDevices = async (req, res) => {
  try {
    const devices = await DeviceMaster.find();
    res.json(devices);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET CARETAKERS =================
exports.getCaretakers = async (req, res) => {
  try {
    const caretakers = await CareTable.find()
      .select("-password"); // exclude password
    res.json(caretakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= UPDATE CARETAKER =================
exports.updateCaretaker = async (req, res) => {
  try {
    const { name, elderName, deviceId } = req.body;

    await CareTable.findByIdAndUpdate(
      req.params.id,
      { name, elderName, deviceId },
      { new: true }
    );

    res.json({ message: "Caretaker Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= DELETE CARETAKER =================
exports.deleteCaretaker = async (req, res) => {
  try {
    await CareTable.findByIdAndDelete(req.params.id);
    res.json({ message: "Caretaker Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ================= GET ALL CARETAKERS (SAFE) =================
exports.getAllCaretakers = async (req, res) => {
  try {
    const caretakers = await CareTable.find().select("-password");
    res.json(caretakers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};