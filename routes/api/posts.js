const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

// Load Post model
const Post = require("../../models/Post");

// Load Profile model
const Profile = require("../../models/Profile");

// Load post validator
const validatePostInput = require("../../validation/post");

// @route   GET api/posts/test
// @desc    Tests posts route
// @access  Public route
router.get("/test", (req, res) => res.json({ msg: "Posts Connected" }));

// @route   GET api/posts/
// @desc    GET posts
// @access  Public
router.get("/", (req, res) => {
	Post.find()
		.sort({ date: -1 })
		.then(posts => res.json(posts))
		.catch(err => res.status(404).json({ post: "Post not found" }));
});

// @route   DELETE api/posts/:id
// @desc    Delete posts by id
// @access  Private
router.delete(
	"/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id).then(post => {
				if (post.user.toString() !== req.user.id) {
					return res.status(401).json({ notauthorized: "user not authorized" });
				} else {
					// Delete post
					post
						.remove()
						.then(() => res.json({ success: "true" }))
						.catch(err => res.status(404).json({ post: "Post not found" }));
				}
			});
		});
	}
);

// @route   GET api/posts/:id
// @desc    GET posts by id
// @access  Public
router.get("/:id", (req, res) => {
	const errors = {};
	Post.findById(req.params.id)
		.then(post => {
			if (!post) {
				errors.post = "Post not found";
				res.status(404).json({ errors });
			} else {
				res.json(post);
			}
		})
		.catch(err => res.status(404).json({ post: "Post not found" }));
});

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
			avatar: req.body.avatar, // ""
			user: req.user.id
		});
		newPost.save().then(post => res.json(post));
	}
);

// @route   Post api/posts/like/:id
// @desc    like posts by id
// @access  Private
router.post(
	"/like/:id",
	passport.authenticate("jwt", { session: false }),
	(req, res) => {
		Profile.findOne({ user: req.user.id }).then(profile => {
			Post.findById(req.params.id)
				.then(post => {
					if (
						post.likes.filter(like => like.user.toString() === req.user.id)
							.length > 0
					) {
						// remove like
						const removeIndex = post.likes
							.map(like => like.user.toString())
							.indexOf(req.user.id);

						// splice the like from the array
						post.likes.splice(removeIndex, 1);

						// save
						post.save().then(post => res.json(post));
					} else {
						Post.findById(req.params.id).then(post => {
							console.log(post.likes);
							console.log(req.user.id);
						});
						post.likes.unshift({ user: req.user.id });
						post.save().then(post => res.json(post));
					}
				})
				.catch(err => res.status(404).json({ post: "Post no found" }));
		});
	}
);

module.exports = router;
