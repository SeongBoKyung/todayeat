const express = require('express');
const router = express.Router();

router.get('/store', (req, res) => {
    res.send('/store/search');
});


module.exports = router;