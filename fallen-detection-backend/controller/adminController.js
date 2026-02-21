const DeviceMaster = require("../model/DeviceMaster");
const CareTable = require("../model/CareTable");

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

exports.createCaretaker = async (req, res) => {
  try {
    const { name, username, password, elderName, deviceId } = req.body;

    // Check username uniqueness
    const userExists = await CareTable.findOne({ username });
    if (userExists) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Check device exists
    const device = await DeviceMaster.findOne({ deviceId });
    if (!device) {
      return res.status(400).json({ message: "Device not found" });
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

exports.getDevices = async (req, res) => {
  const devices = await DeviceMaster.find();
  res.json(devices);
};