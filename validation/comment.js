const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateCommentInput(data) {
	let errors = {};

	// convert data tp empty strings if null ( required bny validator)
	data.text = !isEmpty(data.text) ? data.text : "";

	// test for text length
	// test for empty text
	if (!validator.isLength(data.text, { min: 4, max: 50 })) {
		errors.text = "Comment must be between 4 and 50 characters";
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
