const { tokenGenerate, roomCreate } = require('../libs/twilio');

const TwilioController = {
  getToken: async (req, res) => {
    try {
      const token = tokenGenerate();
      console.log(token);
      res.status(200).json({ token });
    } catch (err) {
      console.log(err);
      res.status(500).json({ message: 'Internal Server Error', error: err });
    }
  },

  addRoom: async (req, res) => {
    try {
      const room = await roomCreate(req, res);
      console.log(room);
      res.status(201).json({ room });
    } catch (err) {
      console.log(err);
      res.status(400).json({
        message: 'An existing Room exists with the same name',
        error: err,
      });
    }
  },
};

module.exports = TwilioController;
