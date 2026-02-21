const express = require("express");
const router = express.Router();
const {
  registerDevice,
  createCaretaker,
  getDevices,
  getCaretakers,
  updateCaretaker,
  deleteCaretaker
} = require("../controller/adminController");

router.post("/device", registerDevice);
router.post("/caretaker", createCaretaker);
router.get("/devices", getDevices);
router.get("/caretakers", getCaretakers);
router.put("/caretaker/:id", updateCaretaker);
router.delete("/caretaker/:id", deleteCaretaker);

module.exports = router;