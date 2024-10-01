const express = require('express');
const router = express.Router();
const { getFilteredMenu } = require('../controllers/menuController');

router.get('/recommend', getFilteredMenu);

module.exports = router;