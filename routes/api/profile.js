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

// @route   POST api/profile
// @desc    create user profile
// @access  Private
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const profileFields = {};
		profileFields.user = req.user.id;

		if (req.body.handle) {
			profileFields.handle = req.body.handle;
		}

		if (req.body.company) {
			profileFields.company = req.body.company;
		}

		if (req.body.website) {
			profileFields.website = req.body.website;
		}

		if (req.body.location) {
			profileFields.location = req.body.location;
		}

		if (req.body.bio) {
			profileFields.bio = req.body.bio;
		}

		if (req.body.status) {
			profileFields.status = req.body.status;
		}

		// Skills is an array
		if (typeof req.body.skills !== "undefined") {
			profileFields.status = req.body.skills.split(","); // split at comma
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				// Profile exists, update profileFields
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: True }
				).then(res.json(profile));
			} else {
				// Create profile

				// Check for handke
				Profile.findOne({ handle: profileFields.handle }).then(profile => {
					if (profile) {
						errors.handle = "That handle already exists";
						res.status(400).json(errors);
					}

					// save profile
					new Profile(profileFields).save().then(profile => res.json(profile));
				});
				ile;
			}
		});

		// // experiences
		// profileFields.experiences = {};
		//
		// if (req.body.title) {
		// 	profileFields.experiences.title = req.body.title;
		// }
		//
		// if (req.body.company) {
		// 	profileFields.experiences.company = req.body.company;
		// }
		//
		// if (req.body.location) {
		// 	profileFields.experiences.location = req.body.location;
		// }
		//
		// if (req.body.bio) {
		//   profileFields.experiences.bio = req.body.bio;
		// }
	}
);

module.exports = router;
