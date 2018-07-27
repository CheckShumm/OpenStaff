const express = require("express");
const router = express.Router();
const gravatar = require("gravatar"); // used for avatar
const bcrypt = require("bcryptjs");

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
	// check if email exists
	User.findOne({ email: req.body.email }).then(user => {
		if (user) {
			return res.status(400).json({ email: "Email already exists.." });
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

module.exports = router;
