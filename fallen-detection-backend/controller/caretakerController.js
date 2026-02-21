const FallData = require("../model/FallData");

exports.getDeviceFallStatus = async (req, res) => {
  try {
    const { deviceId } = req.params;

    const latest = await FallData.findOne({ deviceId })
      .sort({ createdAt: -1 });

    console.log("Latest record:", latest);

    if (!latest) {
      return res.json({ fall: false });
    }

    res.json({
      fall: latest.fall,
      createdAt: latest.createdAt
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};