// previous persons js for email signups

(function(global) {
  function serialize(form){if(!form||form.nodeName!=="FORM"){return }var i,j,q=[];for(i=form.elements.length-1;i>=0;i=i-1){if(form.elements[i].name===""){continue}switch(form.elements[i].nodeName){case"INPUT":switch(form.elements[i].type){case"text":case"hidden":case"password":case"button":case"reset":case"submit":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"checkbox":case"radio":if(form.elements[i].checked){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value))}break;case"file":break}break;case"TEXTAREA":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"SELECT":switch(form.elements[i].type){case"select-one":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break;case"select-multiple":for(j=form.elements[i].options.length-1;j>=0;j=j-1){if(form.elements[i].options[j].selected){q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].options[j].value))}}break}break;case"BUTTON":switch(form.elements[i].type){case"reset":case"submit":case"button":q.push(form.elements[i].name+"="+encodeURIComponent(form.elements[i].value));break}break}}return q.join("&")};


  function extend(destination, source) {
    for (var prop in source) {
      destination[prop] = source[prop];
    }
  }

  if (!Mimi) var Mimi = {};
  if (!Mimi.Signups) Mimi.Signups = {};

  Mimi.Signups.EmbedValidation = function() {
    this.initialize();

    var _this = this;
    if (document.addEventListener) {
      this.form.addEventListener('submit', function(e){
        _this.onFormSubmit(e);
      });
    } else {
      this.form.attachEvent('onsubmit', function(e){
        _this.onFormSubmit(e);
      });
    }
  };

  extend(Mimi.Signups.EmbedValidation.prototype, {
    initialize: function() {
      this.form         = document.getElementById('ema_signup_form');
      this.submit       = document.getElementById('webform_submit_button');
      this.callbackName = 'jsonp_callback_' + Math.round(100000 * Math.random());
      this.validEmail   = /.+@.+\..+/
    },

    onFormSubmit: function(e) {
      e.preventDefault();

      this.validate();
      if (this.isValid) {
        this.submitForm();
      } else {
        this.revalidateOnChange();
      }
    },

    validate: function() {
      this.isValid = true;
      this.emailValidation();
      this.fieldAndListValidation();
      this.updateFormAfterValidation();
    },

    emailValidation: function() {
      var email = document.getElementById('signup_email');

      if (this.validEmail.test(email.value)) {
        this.removeTextFieldError(email);
      } else {
        this.textFieldError(email);
        this.isValid = false;
      }
    },

    fieldAndListValidation: function() {
      var fields = this.form.querySelectorAll('.mimi_field.required');

      for (var i = 0; i < fields.length; ++i) {
        var field = fields[i],
            type  = this.fieldType(field);
        if (type === 'checkboxes' || type === 'radio_buttons') {
          this.checkboxAndRadioValidation(field);
        } else {
          this.textAndDropdownValidation(field, type);
        }
      }
    },

    fieldType: function(field) {
      var type = field.querySelectorAll('.field_type');

      if (type.length) {
        return type[0].getAttribute('data-field-type');
      } else if (field.className.indexOf('checkgroup') >= 0) {
        return 'checkboxes';
      } else {
        return 'text_field';
      }
    },

    checkboxAndRadioValidation: function(field) {
      var inputs   = field.getElementsByTagName('input'),
          selected = false;

      for (var i = 0; i < inputs.length; ++i) {
        var input = inputs[i];
        if((input.type === 'checkbox' || input.type === 'radio') && input.checked) {
          selected = true;
        }
      }

      if (selected) {
        field.className = field.className.replace(/ invalid/g, '');
      } else {
        if (field.className.indexOf('invalid') === -1) {
          field.className += ' invalid';
        }

        this.isValid = false;
      }
    },

    textAndDropdownValidation: function(field, type) {
      var inputs = field.getElementsByTagName('input');

      for (var i = 0; i < inputs.length; ++i) {
        var input = inputs[i];
        if (input.name.indexOf('signup') >= 0) {
          if (type === 'text_field') {
            this.textValidation(input);
          } else {
            this.dropdownValidation(field, input);
          }
        }
      }
      this.htmlEmbedDropdownValidation(field);
    },

    textValidation: function(input) {
      if (input.id === 'signup_email') return;

      if (input.value) {
        this.removeTextFieldError(input);
      } else {
        this.textFieldError(input);
        this.isValid = false;
      }
    },

    dropdownValidation: function(field, input) {
      if (input.value) {
        field.className = field.className.replace(/ invalid/g, '');
      } else {
        if (field.className.indexOf('invalid') === -1) field.className += ' invalid';
        this.onSelectCallback(input);
        this.isValid = false;
      }
    },

    htmlEmbedDropdownValidation: function(field) {
      var dropdowns = field.querySelectorAll('.mimi_html_dropdown');
      var _this = this;

      for (var i = 0; i < dropdowns.length; ++i) {
        var dropdown = dropdowns[i];

        if (dropdown.value) {
          field.className = field.className.replace(/ invalid/g, '');
        } else {
          if (field.className.indexOf('invalid') === -1) field.className += ' invalid';
          this.isValid = false;
          dropdown.onchange = (function(){ _this.validate(); });
        }
      }
    },

    textFieldError: function(input) {
      input.className   = 'required invalid';
      //input.placeholder = input.getAttribute('data-required-field');
    },

    removeTextFieldError: function(input) {
      input.className   = 'required';
      //input.placeholder = '';
    },

    onSelectCallback: function(input) {
      if (typeof Widget === 'undefined' || !Widget.BasicDropdown) return;

      var dropdownEl = input.parentNode,
          instances  = Widget.BasicDropdown.instances,
          _this = this;

      for (var i = 0; i < instances.length; ++i) {
        var instance = instances[i];
        if (instance.wrapperEl === dropdownEl) {
          instance.onSelect = function(){ _this.validate() };
        }
      }
    },

    updateFormAfterValidation: function() {
      this.form.className   = this.setFormClassName();
      this.submit.value     = this.submitButtonText();
      //this.submit.disabled  = !this.isValid;
      this.submit.className = 'button red filled'; //this.isValid ? 'button red filled' : 'button red filled disabled';

      var invalidFields = document.querySelectorAll('.invalid');
      if (!this.isValid && (invalidFields.length || invalidFields[0].className.indexOf('checkgroup') === -1)) {
        $(this.form).children("p.error-message").removeClass("hidden");
      }
    },

    setFormClassName: function() {
      var name = this.form.className;

      if (this.isValid) {
        return name.replace(/\s?mimi_invalid/, '');
      } else {
        if (name.indexOf('mimi_invalid') === -1) {
          return name += ' mimi_invalid';
        } else {
          return name;
        }
      }
    },

    submitButtonText: function() {
      var invalidFields = document.querySelectorAll('.invalid'),
          text;

      text = this.submit.getAttribute('data-default-text');

      /*
      if (this.isValid || !invalidFields) {
        text = this.submit.getAttribute('data-default-text');
      } else {
        if (invalidFields.length || invalidFields[0].className.indexOf('checkgroup') === -1) {
          text = this.submit.getAttribute('data-invalid-text');
        } else {
          text = this.submit.getAttribute('data-choose-list');
        }
      }
      */
      return text;
    },

    submitForm: function() {
      this.formSubmitting();

      var _this = this;
      window[this.callbackName] = function(response) {
        delete window[this.callbackName];
        document.body.removeChild(script);
        _this.onSubmitCallback(response);
      };

      var script = document.createElement('script');
      script.src = this.formUrl('json');
      document.body.appendChild(script);
    },

    formUrl: function(format) {
      var action  = this.form.action;
      if (format === 'json') action += '.json';
      return action + '?callback=' + this.callbackName + '&' + serialize(this.form);
    },

    formSubmitting: function() {
      this.form.className  += ' mimi_submitting';
      this.submit.value     = this.submit.getAttribute('data-submitting-text');
      this.submit.disabled  = true;
      this.submit.className = 'button red filled disabled';

      // ensure error messages are hidden
      var $errorMessage = $(this.form).children("p.error-message");
      $errorMessage.addClass('hidden');
    },

    onSubmitCallback: function(response) {
      if (response.success) {
        this.onSubmitSuccess(response.result);
      } else {
        top.location.href = this.formUrl('html');
      }
    },

    onSubmitSuccess: function(result) {
      if (result.has_redirect) {
        top.location.href = result.redirect;
      } else if(result.single_opt_in || !result.confirmation_html) {
        this.clearForm();
        this.submit.disabled = false;
        this.submit.className = '';
        var $thanksMessage = $(this.form).children("p.thanks-message");
        $thanksMessage.removeClass("hidden");
        setTimeout(function() {
          $thanksMessage.addClass('hidden');
        }, 5000);
        this.submit.value = this.submitButtonText();
      } else {
        this.showConfirmationText(result.confirmation_html);
      }
    },

    showConfirmationText: function(html) {
      var fields = this.form.querySelectorAll('.mimi_field');

      for (var i = 0; i < fields.length; ++i) {
        fields[i].style['display'] = 'none';
      }

      (this.form.querySelectorAll('fieldset')[0] || this.form).innerHTML = html;
    },

    disableForm: function() {
      var elements = this.form.elements;
      for (var i = 0; i < elements.length; ++i) {
        elements[i].disabled = true;
      }
    },

    clearForm: function() {
      var elements = this.form.elements;
      for (var i = 0; i < elements.length; ++i) {
        if (elements[i].type == "text" || elements[i].type == "email") {
          elements[i].value = "";  
        }
      }
    },



    updateSubmitButtonText: function(text) {
      this.submit.value = text;
    },

    revalidateOnChange: function() {
      var fields = this.form.querySelectorAll(".mimi_field.required"),
          _this = this;

      for (var i = 0; i < fields.length; ++i) {
        var inputs = fields[i].getElementsByTagName('input');
        for (var j = 0; j < inputs.length; ++j) {
          if (this.fieldType(fields[i]) === 'text_field') {
            inputs[j].onkeyup = function() {
              var input = this;
              if (input.getAttribute('name') === 'signup[email]') {
                if (_this.validEmail.test(input.value)) _this.validate();
              } else {
                if (input.value.length === 1) _this.validate();
              }
            }
          } else {
            inputs[j].onchange = function(){ _this.validate() };
          }
        }
      }
    }
  });

  if (document.addEventListener) {
    document.addEventListener("DOMContentLoaded", function() {
      new Mimi.Signups.EmbedValidation();
    });
  }
  else {
    window.attachEvent('onload', function() {
      new Mimi.Signups.EmbedValidation();
    });
  }
})(this);