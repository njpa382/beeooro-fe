const { tokenGenerate, roomCreate } = require('../libs/twilio');

const TwilioController = {
  getToken: async (req, res) => {
    const { identity, roomName } = req.query;
    try {
      const token = tokenGenerate(identity, roomName);
      res.status(200).json({ token });
    } catch (err) {
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  addRoom: async (req, res) => {
    const { uniqueName } = req.body;
    try {
      const room = await roomCreate(uniqueName);
      console.log(room);
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
