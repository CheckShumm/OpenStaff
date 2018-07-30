const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post model
const Post = require("../../models/Post");

// Load post validator
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Posts Connected" }));

// @route   POST api/posts/
// @desc    Create posts
// @access  Private

router.post(
	"/",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		const { errors, isValid } = validatePostInput(req.body);

		if (!isValid) {
			res.status(400).json(errors);
		}
		const newPost = new Post({
			text: req.body.text,
			name: req.body.name, // will be dealt with react
			avatar: req.body.name, // ""
			user: req.user.id
		});
		newPost.save().then(post => res.json(post));
	}
);

module.exports = router;
