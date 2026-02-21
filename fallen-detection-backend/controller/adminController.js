const DeviceMaster = require("../model/DeviceMaster");
const CareTable = require("../model/CareTable");

// Register Device
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

// Create Caretaker
exports.createCaretaker = async (req, res) => {
  try {
    const { name, username, password, elderName, deviceId } = req.body;

    const userExists = await CareTable.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    const caretaker = new CareTable({
      name,
      username,
      password,
      elderName,
      deviceId
    });

    await caretaker.save();

    res.json({ message: "Caretaker Created Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get Devices
exports.getDevices = async (req, res) => {
  const devices = await DeviceMaster.find();
  res.json(devices);
};

// Get Caretakers
exports.getCaretakers = async (req, res) => {
  const caretakers = await CareTable.find()
    .populate("deviceId", "deviceId");
  res.json(caretakers);
};

// Update Caretaker (username & password NOT editable)
exports.updateCaretaker = async (req, res) => {
  try {
    const { name, elderName, deviceId } = req.body;

    await CareTable.findByIdAndUpdate(
      req.params.id,
      { name, elderName, deviceId }
    );

    res.json({ message: "Caretaker Updated Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete Caretaker
exports.deleteCaretaker = async (req, res) => {
  try {
    await CareTable.findByIdAndDelete(req.params.id);
    res.json({ message: "Caretaker Deleted Successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};