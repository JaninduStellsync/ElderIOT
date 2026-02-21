const CareTable = require("../model/CareTable");

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (username === "admin" && password === "0000") {
      return res.json({ role: "admin" });
    }

    const caretaker = await CareTable.findOne({ username, password });
    console.log("Caretaker from DB:", caretaker);

    if (!caretaker) {
      return res.status(401).json({ message: "Invalid Credentials" });
    }

    const { password: _, ...safeCaretaker } = caretaker._doc;

    res.json({
      role: "caretaker",
      caretaker: safeCaretaker
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};