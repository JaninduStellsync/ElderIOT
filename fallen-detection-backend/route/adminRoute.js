const express = require("express");
const router = express.Router();
const {
  registerDevice,
  createCaretaker,
  getDevices
} = require("../controller/adminController");

router.post("/device", registerDevice);
router.post("/caretaker", createCaretaker);
router.get("/devices", getDevices);

module.exports = router;