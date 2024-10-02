const express = require('express');
const router = express.Router();
const { getStoreSearch } = require('../controllers/storeController');

router.get('/search', getStoreSearch);

module.exports = router;