const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");

// Load User model
const User = require("../../models/User");

// @route   POST api/users/current
// @desc    current user
// @access  Public
router.get("/test", (req, res) => res.json({ msg: "Profile Connected" }));

// @route   Get api/profile
// @desc    current user profile
// @access  Private
router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const errors = {};
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				if (!profile) {
					errors.profile = "This user does not have a profile";
					return res.status(404).json(errors);
				} else {
					res.json(profile);
				}
			})
			.catch(err => res.status(404).json(err));
	}
);

module.exports = router;
