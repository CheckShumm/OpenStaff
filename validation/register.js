const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateRegisterInput(data) {
	let errors = {};

	// convert data tp empty strings if null ( required bny validator)
	data.name = !isEmpty(data.name) ? data.name : "";
	data.email = !isEmpty(data.email) ? data.email : "";
	data.password = !isEmpty(data.password) ? data.password : "";
	data.password2 = !isEmpty(data.password2) ? data.password2 : "";

	// test for name length
	if (!validator.isLength(data.name, { min: 2, max: 30 })) {
		errors.name = "Name must be between 2 and 30 characters";
	}

	// test for empty name
	if (validator.isEmpty(data.name)) {
		errors.name = "Name field is empty";
	}

	// test for valid email
	if (!validator.isEmail(data.email)) {
		console.log(data.email);
		errors.email = "Email is invalid";
	}

	// test for empty email
	if (validator.isEmpty(data.email)) {
		errors.email = "Email field is empty";
	}

	// test for password length
	if (!validator.isLength(data.password, { min: 6, max: 30 })) {
		errors.password = "Password must be at least 6 characters";
	}

	// test for empty password
	if (validator.isEmpty(data.password)) {
		errors.password = "Password field is empty";
	}

	// test for password matching
	if (!validator.equals(data.password, data.password2)) {
		errors.password2 = "Passwords do not match";
	}

	// test for empty password2
	if (validator.isEmpty(data.password2)) {
		errors.password2 = "Password verification field is empty";
	}

	return {
		errors,
		isValid: isEmpty(errors)
	};
};
