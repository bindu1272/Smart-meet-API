const ApplicationError = require('./ApplicationError');

class ValidationError extends ApplicationError {

	constructor(errors = {}, message = null, customCode = null) {
		super(errors);

		Error.captureStackTrace(this, this.constructor);

		this.name = this.constructor.name;

		this.message = message || 'Request contain some non-validated data.';

		this.errors = errors;

		this.customCode = customCode;
		
		this.status=422;

	}
}

module.exports = ValidationError;
