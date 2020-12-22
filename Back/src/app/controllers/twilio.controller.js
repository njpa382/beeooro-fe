const Twilio = require("../libs/twilio");

class TwilioController {
  static async getToken(req, res) {
    return Twilio.tokenGenerate(req, res);
  }

  static async addRoom(req, res) {
    return await Twilio.roomCreate(req, res);
  }
}

module.exports = TwilioController;
