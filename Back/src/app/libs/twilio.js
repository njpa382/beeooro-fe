const { TWILIO, VARIABLES } = require('../../config/config');
const client = require('twilio')(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);
const AccessToken = require('twilio').jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;
const { IDENTITY_NAME, ROOM_NAME } = VARIABLES;

// Create an Access Token
const accessToken = new AccessToken(
  TWILIO.ACCOUNT_SID,
  TWILIO.KEY_SID,
  TWILIO.KEY_SECRET
);

const Twilio = {
  tokenGenerate: () => {
    // Set the Identity of this token
    accessToken.identity = IDENTITY_NAME;
    const identity = accessToken.identity;
    // Grant access to Video
    const grant = new VideoGrant();
    grant.room = ROOM_NAME;
    const room = grant.room;
    // Serialize the token as a JWT
    const jwt = accessToken.toJwt();

    const access = {
      identity,
      room,
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
