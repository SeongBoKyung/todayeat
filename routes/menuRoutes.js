const express = require('express');
const router = express.Router();

router.post('/login', (req, res) => {
    res.send('/menu/recommand');
});


module.exports = router;