const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validatePostInput(data) {
	let errors = {};

	// convert data tp empty strings if null ( required bny validator)
	data.text = !isEmpty(data.text) ? data.text : "";

	// validate text length
	if (!validator.isLength(data.text, { min: 10, max: 300 })) {
		errors.text = "Post must be between 10 and 300 characters";
	}

	// test for empty text
	if (validator.isEmpty(data.text)) {
		errors.text = "Text field is empty";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
