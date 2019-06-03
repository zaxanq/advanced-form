class Form {
  init() {
    this.step = 3;
    this.stepCount = 5;
    this.registerElements();
    this.initNextStepButton();
    this.disableStepChange();
    this.setStep();
    this.initValidators();
    this.Data = {};
  }

  registerElements() {
    this.tabs = this.class('tab', false);
    this.pages = this.class('content__page', false);

    this.addRequireMarks();
    this.initPhoneNumberInput();
    this.setTabClicks();
  }

  // -------------------- Tabs -------------------- //
  setTabClicks() {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].addEventListener('click', () => {
        if (this.allowTabStepChange(i)) {
          console.log(i);
          this.changeStep(i + 1);
        }
      });
    }
  }

  allowTabStepChange(i) {
    if (this.hasClass('tab--active', this.tabs[i])) return false;
    if (this.hasClass('tab--disabled', this.tabs[i])) return false;
    return true;
  }

  setStep() {
    for (let i = 0; i < this.stepCount; i++) {
      this.removeClass('tab--active', this.tabs[i]);
      this.removeClass('page--active', this.pages[i]);
      this.removeClass('tab--disabled', this.tabs[i]);
      this.hideElement(this.pages[i]);
    }
    for (let i = this.step; i < this.stepCount; i++) {
      if (!this.hasClass('tab--available', this.tabs[i])) {
        this.addClass('tab--disabled', this.tabs[i]);
      }
    }
    this.showElement(this.pages[this.step - 1]);
    this.addClass('tab--available', this.tabs[this.step - 1]);
    setTimeout(() => {
      this.addClass('tab--active', this.tabs[this.step - 1]);
      this.addClass('page--active', this.pages[this.step - 1]);
    }, 0);
  }

  // -------------------- Content -------------------- //

  addRequireMarks() {
    let inputs = document.getElementsByTagName('input');
    [...inputs].map(input => {
      if (input.required) {
        this.addClass('required', input.parentNode);
      }
    });
  }

  initPhoneNumberInput() {
    let phoneNumberInput =  this.id('phone-number');
    phoneNumberInput.value = '+48';
    phoneNumberInput.addEventListener('input', () => {
      if (!this.id('phone-number').value.startsWith('+48')) {
        this.id('phone-number').value = '+48';
      }
    });
  }

  initValidators() {
    this.textInputs = this.class('input--text', false);
    [...this.textInputs].map(input => {
      let validator = input.parentElement.previousElementSibling;
      let errorContainer = input.nextElementSibling;
      input.addEventListener('input', () => {
        let validation = this.validateInput(input);
        if (validation.result) {
          this.removeClass('validation--invalid', validator);
          this.addClass('validation--valid', validator);
          this.renderInputError(errorContainer, '');
          if (this.checkStepInputs()) {
            this.allowStepChange();
          }
        } else {
          this.disableStepChange();
          this.addClass('validation--invalid', validator);
          this.removeClass('validation--valid', validator);
          this.renderInputError(errorContainer, validation.reason);
        }
      });
      input.addEventListener('focusout', () => {
        this.saveInputValue(input);
      });
    })
  }

  saveInputValue(input) {
    if (input.id === 'first-name' || input.id === 'last-name') {
      input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
    }
    if (input.value !== '' || (input.id === 'phone-number' && input.value !== '+48')) {
      this.Data[input.id] = input.value;
    }
    console.log(this.Data);
  }

  validateInput(input) {
    if (input.id === 'username') {
      if (!input.checkValidity()) {
        return {result: false, reason: 'Username is too short.'}
      }
      if (!(new RegExp(/^[a-zA-Z0-9]/)).test(input.value)) {
        return {result: false, reason: 'Username must start with a letter or a digit'};
      }
      if (!(new RegExp(/[a-zA-Z0-9]$/)).test(input.value)) {
        return {result: false, reason: 'Username must end with a letter or a digit'};
      }
    } else if (input.id === 'email') {
      if (!input.checkValidity()) {
        return {result: false, reason: 'Email address incorrect.'}
      }
      if (!(new RegExp(/^[a-zA-Z0-9]/)).test(input.value)) {
        return {result: false, reason: 'Email address must start with a letter or a digit'};
      }
    } else if (input.id === 'password' || input.id === 'repeat-password') {
      let passwordInput = this.id('password');
      let retypepwInput = this.id('repeat-password');

      if (!passwordInput.checkValidity()) {
        return {result: false, reason: 'Password is too short.'}
      }
      if ((new RegExp(/(\w)\1{2}/)).test(passwordInput.value)) {
        return {result: false, reason: 'Password cannot have 3 same characters in a row.'}
      }
      if (passwordInput.value.toLowerCase() === this.Data.username.toLowerCase() ||
        passwordInput.value.toLowerCase().includes(this.Data.username.toLowerCase())) {
        return {result: false, reason: 'Password cannot be similar to username.'}
      }
      if (typeof retypepwInput.value !== 'undefined' && retypepwInput.value !== '') {
          if (passwordInput.value !== retypepwInput.value) {
            return {result: false, reason: 'Passwords cannot be different.'}
          }
      }
      let valueLC = input.value.toLowerCase();
      let emailLC = this.Data.email.toLowerCase();
      if (valueLC === emailLC ||
        (emailLC !== '' && valueLC.includes(emailLC.slice(0, emailLC.indexOf('@'))))) {
        return {result: false, reason: 'Password cannot be similar to email address.'}
      }
    } else if (input.id === 'repeat-password') {
      if (input.value !== this.Data.password) {
        return {result: false, reason: 'Passwords cannot be different.'}
      }
    } else if (input.id === 'phone-number') {
      if (!(new RegExp(/^[0-9+]+$/)).test(input.value)) {
        return {result: false, reason: 'Phone number can contain only numbers.'}
      }
      if (input.value.length < 12 && input.value.length > 3) {
        return {result: false, reason: 'Invalid phone number.'}
      }
    } else if (input.id === 'first-name' || input.id === 'last-name') {
      if (input.value === '' && input.required) {
        return {result: false, reason: 'Name is required.'}
      }
      if (!(new RegExp(/^[a-zA-Z ']+$/)).test(input.value) && input.value !== '') {
        return {result: false, reason: 'Name can contain only letters, spaces and an apostrophe.'}
      }
    } else if (input.id === 'birth-date') {
      if (!input.checkValidity() ||
        !(new RegExp(/^([0-9]{2})+\.+([0-9]{2})+\.+[0-9]{4}/))
          .test(input.value)) {
        return {result: false, reason: 'Invalid date format.'}
      }
      let birthdate = input.value.split('.').map(data => parseInt(data));
      if (!this.checkDay(birthdate) || !this.checkMonth(birthdate) || !this.checkYear(birthdate)) {
        return {result: false, reason: 'Invalid date.'}
      }
    }
    return {result: true, reason: ''};
  }

  renderInputError(container, reason) {
    container.innerText = reason;
  }

  checkDay(date) {
      // check february
    if ((date[0] > 28 && date[1] === 2 && (date[2] % 4 !== 0 && date[2] % 100 !== 0) || (date[2] % 100 === 0)) ||
      // check april, june, september & november
      (date[0] > 30 && [4,6,9,11].includes(date[1])) ||
      // check january, march, may, july, august, october & december
      (date[0]) > 31 ||
      date[0] <= 0) {
        return false;
    }
    return true;
  }

  checkMonth(date) {
    if (date[1] > 12 || date[1] <= 0) {
      return false;
    }
    return true;
  }

  checkYear(date) {
    if (date[2] < 1900 || date[2] > (new Date).getFullYear()) {
      return false;
    }
    return true;
  }

  checkStepInputs() {
    if (this.step === 1) {
      if (this.checkInputs(['username', 'email', 'password', 'repeat-password'])) {
        return true;
      }
    } else if (this.step === 2) {
      if (this.checkInputs(['first-name', 'last-name', 'phone-number', 'birth-date'])) {
        return true;
      }
    } else if (this.step === 3) {
      if (this.checkInputs(['address-city', 'address-zip', 'address-street', 'address-building'])) {
        return true;
      }
    } else if (this.step === 4) {
      return true;
    }
    return false;
  }

  checkInputs(inputs) {
    for (let i = 0; i < inputs.length; i++) {
      console.log(inputs[i], !this.id(inputs[i]).value, this.id(inputs[i]).value === '', this.id(inputs[i]).required, !this.validateInput(this.id(inputs[i])).result);
      if (((!this.id(inputs[i]).value || this.id(inputs[i]).value === '') && this.id(inputs[i]).required) ||
        !this.validateInput(this.id(inputs[i])).result) {
        return false;
      }
    }
    return true;
  }

  // -------------------- Step mechanics ------------------- //
  initNextStepButton() {
    this.nextStepButtons = this.class('button--next-step', false);

    for (let i = 0; i < this.nextStepButtons.length; i++) {
      this.nextStepButtons[i].addEventListener('click', () => {
        this.changeStep(i + 2);
      });
    }
  }

  changeStep(step) {
    this.step = step;
    this.setStep();
    console.log(step);
  }

  allowStepChange() {
    this.nextStepButtons[this.step - 1].disabled = false;
  }

  disableStepChange() {
    this.nextStepButtons[this.step - 1].disabled = true;
  }

  // -------------------- Helpful methods -------------------- //
  class(className, firstOnly = true) {
    let elements = document.getElementsByClassName(className);
    return firstOnly ? elements[0] : elements;
  }

  id(idName) {
    return document.getElementById(idName);
  }

  addClass(className, element) {
    element.classList.add(className);
  }

  removeClass(className, element) {
    element.classList.remove(className);
  }

  hasClass(className, element) {
    return element.classList.contains(className);
  }

  showElement(element) {
    element.style.display ='block';
  }

  hideElement(element) {
    element.style.display = 'none';
  }
}

(new Form).init();
