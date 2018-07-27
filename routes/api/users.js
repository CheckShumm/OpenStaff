const express = require("express");
const router = express.Router();

// @route   GET api/users/test
// @desc    Tests posts route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Users Connected" }));

module.exports = router;
