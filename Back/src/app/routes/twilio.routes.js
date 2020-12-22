const { Router } = require("express");
const TwilioController = require("../controllers/twilio.controller");
const router = Router();

router
  .get("/token", TwilioController.getToken)
  .post("/addRoom", TwilioController.addRoom);

module.exports = router;
