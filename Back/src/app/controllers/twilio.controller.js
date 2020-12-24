const { tokenGenerate, roomCreate } = require('../libs/twilio');

const TwilioController = {
  getToken: async (req, res) => {
    try {
      const token = tokenGenerate();
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  addRoom: async (req, res) => {
    try {
      const { uniqueName } = req.body;
      const room = await roomCreate(uniqueName);
      res.status(201).json({ room });
    } catch (err) {
      res.status(400).json({
        message: 'An existing Room exists with the same name',
        error: err,
      });
    }
  },
};

module.exports = TwilioController;
