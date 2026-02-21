const express = require("express");
const router = express.Router();
const { getDeviceFallStatus ,
       getMonthlyFallReport
} = require("../controller/caretakerController");

router.get("/fall/:deviceId", getDeviceFallStatus);

router.get("/monthly-report", getMonthlyFallReport);

module.exports = router;