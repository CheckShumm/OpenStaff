const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Profile model
const Profile = require("../../models/Profile");

// Load User model
const User = require("../../models/User");

// Load education validator
const validateEducationInput = require("../../validation/education");

// Load profile validation
const validateProfileInput = require("../../validation/profile");

// Load experience validation
const validateExperienceInput = require("../../validation/experience");

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
			.populate("user", ["name", "avatar"])
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

// @route   Get api/profile
// @desc    current user profile
// @access  Private
router.get(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const errors = {};
		Profile.findOne({ user: req.user.id })
			.populate("user", ["name", "avatar"])
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

// @route   GET api/profile/all
// @desc    get all profiles
// @access  Public
router.get("/all", (req, res) => {
	const errors = {};
	Profile.find()
		.populate("users", ["name", "avatar"])
		.then(profiles => {
			if (!profiles) {
				errors.profiles = "No profiles found";
				res.status(404).json(errors);
			} else {
				res.json(profiles);
			}
		})
		.catch(err => res.send({ profiles: "No profiles found" }));
});

// @route   GET api/profile/handle/:handle
// @desc    get profile by handle
// @access  Public
router.get("/handle/:handle", (req, res) => {
	const errors = {};
	Profile.findOne({ handle: req.params.handle })
		.populate("users", ["name", "avatar"])
		.then(profile => {
			if (!profile) {
				errors.profile = "There is no profile for this user";
				res.status(404).json(errors);
			} else {
				res.json(profile);
			}
		})
		.catch(err => res.status(404).json(err));
});

// @route   GET api/profile/user/:user_id
// @desc    get profile by user ID
// @access  Public
router.get("/user/:user_id", (req, res) => {
	const errors = {};

	Profile.findOne({ user: req.params.user_id })
		.populate("user", ["name", "avatar"])
		.then(profile => {
			if (!profile) {
				errors.profile = "There is no profile for this user id";
				res.status(400).json(errors);
			} else {
				res.json(profile);
			}
		})
		.catch(err =>
			res.status(404).json({ profile: "There is no profile for this user id" })
		);
});

// @route   POST api/profile
// @desc    create user profile
// @access  Private
router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateProfileInput(req.body);

		// check validation for profile fields
		if (!isValid) {
			// return errors
			return res.status(400).json({ errors });
		}

		// get aLL fields
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

		if (req.body.contactnumber) {
			profileFields.contactnumber = req.body.contactnumber;
		}

		// Skills is an array
		if (typeof req.body.skills !== "undefined") {
			profileFields.skills = req.body.skills.split(","); // split at comma
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			if (profile) {
				// Profile exists, update profileFields
				Profile.findOneAndUpdate(
					{ user: req.user.id },
					{ $set: profileFields },
					{ new: true }
				)
					.then(res.json(profile))
					.catch(err => console.log(err));
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
			}
		});
	}
);

// @route   POST api/profile/experience
// @desc    create or edit experiences
// @access  Private
router.post(
	"/experience",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateExperienceInput(req.body);

		// check validation for profile fields
		if (!isValid) {
			// return errors
			return res.status(400).json({ errors });
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			const newExp = {
				title: req.body.title,
				company: req.body.company,
				location: req.body.location,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// add to exp array
			profile.experience.unshift(newExp);
			profile.save().then(profile => res.json(profile));
		});
	}
);

// @route   POST api/profile/education
// @desc    create or edit education
// @access  Private
router.post(
	"/education",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validateEducationInput(req.body);

		// check validation for profile fields
		if (!isValid) {
			// return errors
			return res.status(400).json({ errors });
		}

		Profile.findOne({ user: req.user.id }).then(profile => {
			const newEdu = {
				school: req.body.school,
				degree: req.body.degree,
				fieldofstudy: req.body.fieldofstudy,
				from: req.body.from,
				to: req.body.to,
				current: req.body.current,
				description: req.body.description
			};

			// add to exp array
			profile.education.unshift(newEdu);
			profile.save().then(profile => res.json(profile));
		});
	}
);

// @route   DELETE api/profile/experience/:exp_id
// @desc    remove an experience from profile
// @access  Private
router.delete(
	"/experience/:exp_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// Get remove index
				const removeIndex = profile.experience
					.map(exp => exp.id)
					.indexOf(req.params.exp_id);
				// splice
				profile.experience.splice(removeIndex, 1);

				// save
				profile.save().then(profile => res.json(profile));
			})
			.catch(err => res.status(404).json(err));
	}
);

// @route   DELETE api/profile/education/:edu_id
// @desc    remove an education from profile
// @access  Private
router.delete(
	"/education/:edu_id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id })
			.then(profile => {
				// Get remove index
				const removeIndex = profile.education
					.map(edu => edu.id)
					.indexOf(req.params.edu_id);
				// splice
				profile.education.splice(removeIndex, 1);

				// save
				profile.save().then(profile => res.json(profile));
			})
			.catch(err => res.status(404).json(err));
	}
);

// @route   DELETE api/profile/
// @desc    remove user and their profile
// @access  Private
router.delete(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOneAndRemove({ user: req.user.id })
			.then(profile => {
				User.findOneAndRemove({ _id: req.user.id }).then(() =>
					res.json({ success: true })
				);
			})
			.catch(err => res.status(404).json(err));
	}
);
module.exports = router;
