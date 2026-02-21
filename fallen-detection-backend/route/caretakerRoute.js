const express = require("express");
const router = express.Router();
const { getDeviceFallStatus } = require("../controller/caretakerController");

router.get("/fall/:deviceId", getDeviceFallStatus);

module.exports = router;