const { TWILIO } = require('../../config/config');
const { ACCOUNT_SID, AUTH_TOKEN, KEY_SID, KEY_SECRET } = TWILIO;
const client = require('twilio')(ACCOUNT_SID, AUTH_TOKEN);
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

const Twilio = {
  tokenGenerate: (identity, roomName) => {
    // Create an Access Token
    const accessToken = new AccessToken(ACCOUNT_SID, KEY_SID, KEY_SECRET, {
      identity: identity,
    });
    // Grant access to Video
    const grant = new VideoGrant({
      room: roomName,
    });
    accessToken.addGrant(grant);
    // Serialize the token as a JWT
    const jwt = accessToken.toJwt();

    const access = {
      token: jwt,
    };

    return access;
  },

  roomCreate: async roomName => {
    return await client.video.rooms.create({
      uniqueName: roomName,
    });
  },
};

module.exports = Twilio;
