const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
	let errors = {};

	// convert data tp empty strings if null ( required bny validator)
	data.title = !isEmpty(data.title) ? data.title : "";
	data.company = !isEmpty(data.company) ? data.company : "";
	data.from = !isEmpty(data.from) ? data.from : "";

	// test for empty company
	if (validator.isEmpty(data.company)) {
		errors.company = "company field is empty";
	}

	// test for empty title
	if (validator.isEmpty(data.title)) {
		errors.title = "Title field is empty";
	}

	// test for empty from
	if (validator.isEmpty(data.from)) {
		errors.from = "From field is empty";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
