const { TWILIO } = require("../../config/config");
const client = require("twilio")(TWILIO.ACCOUNT_SID, TWILIO.AUTH_TOKEN);
const AccessToken = require("twilio").jwt.AccessToken;
const VideoGrant = AccessToken.VideoGrant;

// Create an Access Token
const accessToken = new AccessToken(
  TWILIO.ACCOUNT_SID,
  TWILIO.KEY_SID,
  TWILIO.KEY_SECRET
);

const Twilio = {};

Twilio.tokenGenerate = (req, res) => {
  // Set the Identity of this token
  accessToken.identity = "beeooro-user";

  // Grant access to Video
  const grant = new VideoGrant();
  grant.room = "beeooro room";
  accessToken.addGrant(grant);
  console.log(grant);
  console.log(accessToken);

  // Serialize the token as a JWT
  const jwt = accessToken.toJwt();
  console.log(jwt);

  res.status(200).json({ token: jwt });
};

Twilio.roomCreate = async (req, res) => {
  try {
    const room = await client.video.rooms.create({
      uniqueName: req.body.uniqueName,
    });
    console.log(room);
    res.status(201).json({ room });
  } catch (error) {
    console.log(error);
    res.status(400).json({ error });
  }
};

module.exports = Twilio;
