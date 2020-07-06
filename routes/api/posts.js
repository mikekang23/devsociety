const express = require('express');
const router = express.Router();

// @route GET api/users
// @desc Test router
// @access Public
router.get('/post', (req, res) => {
  res.send('post route');
});

module.exports = router;
