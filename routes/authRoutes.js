const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.send('/auth/login');
});

module.exports = router;