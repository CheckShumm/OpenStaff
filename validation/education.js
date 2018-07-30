const validator = require("validator");
const isEmpty = require("./is-empty");

module.exports = function validateExperienceInput(data) {
	let errors = {};

	// convert data tp empty strings if null ( required bny validator)
	data.school = !isEmpty(data.school) ? data.school : "";
	data.degree = !isEmpty(data.degree) ? data.degree : "";
	data.fieldofstudy = !isEmpty(data.fieldofstudy) ? data.fieldofstudy : "";
	data.from = !isEmpty(data.from) ? data.from : "";

	// test for empty school
	if (validator.isEmpty(data.school)) {
		errors.school = "School field is empty";
	}

	// test for empty degree
	if (validator.isEmpty(data.degree)) {
		errors.degree = "Degree field is empty";
	}

	// test for empty fieldofstudy
	if (validator.isEmpty(data.fieldofstudy)) {
		errors.fieldofstudy = "Field of study field is empty";
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
