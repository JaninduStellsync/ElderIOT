const express = require("express");
const router = express.Router();
const {
  registerDevice,
  createCaretaker,
  getDevices,
  getCaretakers,
  updateCaretaker,
  deleteCaretaker,
  getAllCaretakers   
} = require("../controller/adminController");

router.post("/device", registerDevice);
router.post("/caretaker", createCaretaker);
router.get("/devices", getDevices);
router.get("/caretakers", getCaretakers);
router.put("/caretaker/:id", updateCaretaker);
router.delete("/caretaker/:id", deleteCaretaker);
router.get("/caretakers/all", getAllCaretakers);

module.exports = router;