function QValidate(form) {
	properties = {
		'errors': {},
		'mode' : 'normal'
	},
	messages = {
		'name': 'Error, please ensure you are typing your name with only alpha numaric characters.<br/>',
		'text': 'Error, please ensure you are entering only alpha numaric characters .<br/>',
		'email': 'Error, please ensure that your email is entered correctly.<br/>',
		'tel': 'Error, please ensure that your phone number is entered correctly.<br/>',
		'default': 'There was an error with your input, please ensure you are following the guidelines and add your input again.<br/>'
	},
	rules = {
		'name': /^[a-zA-Z,ü,ö,ä -\.]+$/,
		'email': /^([0-9a-zA-Z-_\.]*?@([0-9a-zA-Z-_\.]*\.\w{2,4}))$/,
		'tel': /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/,
		'text': /^[a-zA-Z0-9\s,'-\/&!\.]+$/	
	},
	templates = {
		'message' : '<p id="errors"></p>'
	}

	var _construct = function(form) {
		properties['form'] = (form === null) ? null : form;
	};

	var setError = function(type, input) {
		if (properties.mode !== 'quiet')
			input.parent().addClass('error').removeClass('success');
		
			properties['errors'][type] = (messages[type] !== undefined) ? messages[type] : messages['default'];
	};

	var clearErrors = function(type, input) {
		if (type) {
			properties.errors[type] = '';
		}

		if (input && (properties.mode !== 'quiet')) {
			input.parent().addClass('success').removeClass('error');
		}
	};

	var validate = function(input) {
		var type = $(input).data('validation'),
			valid = false;

		if (input) {
			// run this on the input

			if (input.val().match(rules[type])) {
				clearErrors(type, input);
				valid = true; 
			} else {
				setError(type, input);
			};
		}

		if(properties.mode !== 'quiet')
			showErrors();

		isValid = valid;
		return valid;
	};

	var showErrors = function() {
		var string = '';

		$.each(properties.errors, function(k,v) {
			string += v;
		});

		if (string.length > 1) {
			if ($('#errors').length == 0)
				properties.form.append(templates.message);

			$('#errors').html(string).slideDown();
		} else {
			$('#errors').html('').slideUp();
		}

	};

	var isRequired = function(input) {
		var required = true;

		if (input.val().length == 0 && !input.prop('required')) {
			required = false;
		}

		return required;
	};

	this.Validated = function(input, setMode) {
		properties.mode = (setMode !== undefined) ? setMode : properties.mode;

		if (input && isRequired(input)) {
			return validate(input);
		} else if (!input) {
			var valid = true;

			// If there was no form set and no input set, we don't know where to start.
			if (!properties.form) 
				return false;

			properties.form.find('input').each(function(k, v){
				if (isRequired($(this)) && !validate($(this))) {
					valid = false;
				}
			});

			return valid;
		}
	};

	this.Set = function(propertyName, value) {
		if (propertyName === undefined || typeof(propertyName) !== 'string' || typeof(value) !== 'string')
			return false;

		properties[propertyName] = value;
		return true;
	};

	this.AddRule = function(ruleName, rule, errorMessage) {
		if (ruleName === undefined || rule === undefined) 
			return false;

		if (typeof(ruleName) === 'string')
			rules[ruleName] = rule;

		if (errorMessage !== undefined && typeof(errorMessage) === 'string')
			messages[ruleName] = errorMessage;
	
		return true;

	};

	this.GetErrors = function() {
		return properties.errors;
	};

	_construct(form);
}