const express = require("express");
const router = express.Router();
const homeController = require("../controllers/homeController");
const auth = require("../middleware/auth");

// Public Route (Status/Health Check) - Optional: Keep public or secure?
// Keeping status public is often good for monitoring, but can be secured if desired.
// Let's secure everything except likely status if requested, but for now secure ALL API actions.
// Actually, usually '/' or '/status' might be public. Let's make '/' public and secure the rest.

router.get("/", homeController.getHome);
router.get("/status", homeController.getStatus);

// Apply Auth Middleware to all routes below
router.use(auth);

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
