const config = {
  TWILIO: {
    ACCOUNT_SID: process.env.TWILIO_ACCOUNT_SID,
    AUTH_TOKEN: process.env.TWILIO_AUTH_TOKEN,
    FRIENDLY_NAME: process.env.TWILIO_FRIENDLY_NAME,
    KEY_TYPE: process.env.TWILIO_KEY_TYPE,
    KEY_SID: process.env.TWILIO_API_KEY_SID,
    KEY_SECRET: process.env.TWILIO_API_KEY_SECRET,
  },
};

module.exports = config;
