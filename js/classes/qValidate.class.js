function QValidate(form) {
	properties = {
		'errors': {},
		'level' : 'light'
	},
	messages = {
		'text': 'Error, please ensure you are typing your name with only alpha numaric characters.</br>',
		'email': 'Error, please ensure that your email is entered correctly.</br>',
		'tel': 'Error, please ensure that your phone number is entered correctly.</br>'
	},
	rules = {
		'light': {
			'name': /^[a-zA-Z,ü,ö,ä -\.]+$/,
			'email': /^([0-9a-zA-Z-_\.]*?@([0-9a-zA-Z-_\.]*\.\w{2,4}))$/,
			'tel': /^\s*(?:\+?(\d{1,3}))?([-. (]*(\d{3})[-. )]*)?((\d{3})[-. ]*(\d{2,4})(?:[-.x ]*(\d+))?)\s*$/,
			'text': /^[a-zA-Z,ü,ö,ä -\d\.]+$/
		}
	};

	var _construct = function(form) {
		properties['form'] = form;
	};

	var setError = function(type, input) {
		input.parent().addClass('error').removeClass('success');
		properties['errors'][type] = messages[type];
	};

	var clearErrors = function(type, input) {
		if (type) {
			properties.errors[type] = '';
		}

		if (input) {
			input.parent().addClass('success').removeClass('error');
		}
	};

	var validate = function(level, input) {
		var type = $(input).data('validation'),
			valid = false;

		if (input) {
			// run this on the input
			if (input.val().match(rules[level][type])) {
				clearErrors(type, input);
				valid = true; 
			} else {
				setError(type, input);
			};
		}

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

	this.validated = function(level, input) {
		var level = (level) ? level : properties.level;

		if (input && isRequired(input)) {
			return validate(level, input);
		} else if (!input) {
			var valid = true;

			properties.form.find('input').each(function(k, v){
				if (isRequired($(this)) && !validate(level, $(this))) {
					valid = false;
				}
			});

			return valid;
		}
	};

	_construct(form);
}