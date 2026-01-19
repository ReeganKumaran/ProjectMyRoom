const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");

router.get("/", homeController.getHome);
router.get("/status", homeController.getStatus);

// IOT Device
router.get("/listIOTDevice", homeController.listIOTDevice);
router.post("/addIOTDevice", homeController.addIOTDevice);
router.post("/editIOTDevice", homeController.editIOTDevice);
router.post("/deleteIOTDevice", homeController.deleteIOTDevice);

// Device
router.get("/listDevice", homeController.listDevice);
router.post("/addDevice", homeController.addDevice);
router.post("/editDevice", homeController.editDevice);
router.post("/changeDeviceStatus", homeController.changeDeviceStatus);
router.post("/deleteDevice", homeController.deleteDevice);

module.exports = router;
