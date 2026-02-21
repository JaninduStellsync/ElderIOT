const CareTable = require("../model/CareTable");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Admin login
    if (username === "admin" && password === "0000") {
      return res.json({ role: "admin" });
    }

    // Caretaker login
    const caretaker = await CareTable.findOne({ username, password });

    if (!caretaker) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    res.json({
      role: "caretaker",
      caretaker
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};