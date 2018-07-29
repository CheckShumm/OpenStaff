const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateProfileInput(data) {
	let errors = {};

	// convert data tp empty strings if null ( required bny validator)
	data.handle = !isEmpty(data.handle) ? data.handle : "";
	data.status = !isEmpty(data.status) ? data.status : "";
	data.skills = !isEmpty(data.skills) ? data.skills : "";
	data.contactnumber = !isEmpty(data.contactnumber) ? data.contactnumber : "";

	// test for valid handle
	if (!validator.isLength(data.handle, { min: 2, max: 40 })) {
		errors.handle = "Handle must be at least 2 characters long";
	}

	// test for empty handle
	if (validator.isEmpty(data.handle)) {
		errors.handle = "Handle field is empty";
	}

	// test for empty status
	if (validator.isEmpty(data.status)) {
		errors.status = "Status field is empty";
	}

	// test for empty skills
	if (validator.isEmpty(data.skills)) {
		errors.skills = "Status field is empty";
	}

	// test for empty skills
	if (validator.isEmpty(data.contactnumber)) {
		errors.contactnumber = "Please provide a contact number";
	}

	// check if website is url
	if (!isEmpty(data.website)) {
		if (!Validator.isURL(data.website)) {
			errors.website = "Not a valid URL";
		}
	}
	return {
		errors,
		isValid: isEmpty(errors)
	};
};
