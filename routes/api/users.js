const express = require("express");
const router = express.Router();
const gravatar = require("gravatar"); // used for avatar
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const keys = require("../../config/keys");
const passport = require("passport");

// Load login validation
const validateRegisterInput = require("../../validation/register");
const validateLoginInput = require("../../validation/login");

// Load User model
const User = require("../../models/User");

// @route   GET api/users/test
// @desc    Tests posts route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Users Connected" }));

// @route   POST api/users/test
// @desc    Register user
// @access  Public route
router.post("/register", (req, res) => {
	const { errors, isValid } = validateRegisterInput(req.body);

	// check validation for registration
	if (!isValid) {
		return res.status(400).json({ errors });
	}

	// check if email exists
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			errors.email = "Email already exists";
			return res.status(400).json({ errors });
		} else {
			const avatar = gravatar.url(req.body.email, {
				s: "200", // size
				r: "pg", // ratikng
				d: "mm" // default
			});
			const newUser = new User({
				name: req.body.name,
				email: req.body.email,
				avatar,
				password: req.body.password
			});

			// Hashing user password
			bcrypt.genSalt(10, (err, salt) => {
				bcrypt.hash(newUser.password, salt, (err, hash) => {
					if (err) throw err;
					newUser.password = hash;
					newUser
						.save()
						.then(user => res.json(user))
						.catch(err => console.log(err));
				});
			});
		}
	});
});

// @route   GET api/users/login
// @desc    Login user / Return JWT token
// @access  Public
router.post("/login", (req, res) => {
	const { errors, isValid } = validateLoginInput(req.body);

	// check validation for registration
	if (!isValid) {
		return res.status(400).json({ errors });
	}

	const email = req.body.email;
	const password = req.body.password;

	// find user by Email
	User.findOne({ email: email }).then(user => {
		// check if user exists
		if (!user) {
			errors.email = "User not found";
			return res.status(404).json({ errors });
		} else {
			// check password
			bcrypt.compare(password, user.password).then(isMatch => {
				if (isMatch) {
					// password matches

					// Create JWT payload
					const payload = {
						id: user.id,
						name: user.name,
						avatar: user.avatar
					};

					// Sign JWT token
					jwt.sign(
						payload,
						keys.secretOrKey,
						{ expiresIn: 36000 },
						(err, token) => {
							res.json({
								succes: true,
								token: "Bearer " + token
							});
						}
					);
				} else {
					// password doesnt match
					errors.password = "password incorrect";
					return res.status(400).json({ errors });
				}
			});
		}
	});
});

// @route   POST api/users/current
// @desc    current user
// @access  Private
router.get(
	"/current",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		res.json({
			id: req.user.id,
			name: req.user.name,
			email: req.user.email
		});
	}
);

module.exports = router;
