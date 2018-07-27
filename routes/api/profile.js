const express = require("express");
const router = express.Router();

// @route   GET api/profile/test
// @desc    Tests posts route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Profile Connected" }));

module.exports = router;
