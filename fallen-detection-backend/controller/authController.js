const CareTable = require("../model/CareTable");
const bcrypt = require("bcryptjs");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // ================= ADMIN LOGIN =================
    if (username === "admin" && password === "0000") {
      return res.json({ role: "admin" });
    }

    // ================= CARETAKER LOGIN =================
    const caretaker = await CareTable.findOne({ username });

    if (!caretaker) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // 🔐 Compare hashed password
    const isMatch = await bcrypt.compare(password, caretaker.password);

    if (!isMatch) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    // Remove password from response
    const { password: _, ...safeCaretaker } = caretaker._doc;

    res.json({
      role: "caretaker",
      caretaker: safeCaretaker
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};