const { Router } = require('express');
const { getToken, addRoom } = require('../controllers/twilio.controller');
const router = Router();

router.get('/token', getToken).post('/addRoom', addRoom);

module.exports = router;
