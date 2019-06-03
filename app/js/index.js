class Form {
  init() {
    this.step = 1;
    this.stepCount = 5;

    this.Lang = {
      'step': 'Krok',
      'proceed': 'Dalej',
      inputs: {
        'username': 'Nazwa użytkownika',
        'email': 'Adres email',
        'password': 'Hasło',
        'repeat-password': 'Powtórz hasło',
        'first-name': 'Imię',
        'last-name': 'Nazwisko',
        'phone-number': 'Numer telefonu',
        'birth-date': 'Data urodzenia',
        'address-city': 'Miasto',
        'address-zip': 'Kod pocztowy',
        'address-street': 'Ulica',
        'address-building': 'Numer budynku/mieszkania',
      },
    };

    this.Data = {};

    this.initInputs();
    this.createElements();
    this.registerElements();
    this.initNextStepButton();
    this.disableStepChange();
    this.setStep();
    this.initValidators();
  }

  // -------------------- Form generation ------------------- //

  initInputs() {
    let Input = function Input(id, minlength, maxlength, placeholder, type, label, required = false) {
      this.inputId = id;
      this.minlen = minlength;
      this.maxlen = maxlength;
      this.placeholder = placeholder;
      this.type = type;
      this.label = label;
      this.required = required;

      this.create = (function () {
        let input = document.createElement('input');
        input.id = this.inputId;
        input.type = this.type;
        input.minLength = this.minlen;
        input.maxLength = this.maxlen;
        input.placeholder = this.placeholder;
        input.required = this.required;
        input.classList.add('input', 'input--text');
        return input;
      }).bind(this);
    };

    this.Inputs = [
      [
        new Input('username', 4, 16, 'JanKow', 'text', this.Lang['username'], true),
        new Input('email', 4, 128, 'jan.kowalski@gmail.com', 'email', this.Lang['email'], true),
        new Input('password', 6, 32, 'hasło123', 'password', this.Lang['password'], true),
        new Input('repeat-password', 6, 32, 'hasło123', 'password', this.Lang['repeat-password'], true),
      ],
      [
        new Input('first-name', 2, 32, 'Jan', 'text', this.Lang['first-name'], true),
        new Input('last-name', 0, 32, 'Kowalski', 'text', this.Lang['last-name']),
        new Input('phone-number', 0, 12, '+48123456789', 'text', this.Lang['phone-number']),
        new Input('birth-date', 10, 32, '31.12.1970', 'text', this.Lang['birth-date']),
      ],
      [
        new Input('address-city', 2, 32, 'Warszawa', 'text', this.Lang['address-city'], true),
        new Input('address-zip', 0, 6, '00-000', 'text', this.Lang['address-zip']),
        new Input('address-street', 0, 32, 'Katowicka', 'text', this.Lang['address-street']),
        new Input('address-building', 0, 32, '25/4A', 'text', this.Lang['address-building']),
      ],
      [
        new Input('012', 0, 32, 'Warszawa', 'text'),
        new Input('034', 0, 32, '00-000', 'text'),
        new Input('056', 0, 32, 'Katowicka', 'text'),
        new Input('078', 0, 32, '25/4A', 'text'),
      ],
      [
        new Input('112', 0, 32, 'Warszawa', 'text'),
        new Input('134', 0, 32, '00-000', 'text'),
        new Input('156', 0, 32, 'Katowicka', 'text'),
        new Input('178', 0, 32, '25/4A', 'text'),
      ]
    ];
  }

  createElements() {
    for (let i = 1; i <= this.stepCount; i++) {
      this.createTab(i);
      this.createPage(i);
    }
  }

  createTab(n) {
    let menuItemElement = document.createElement('li');
    this.addClass(['menu__item', 'tab', 'tab--disabled'], menuItemElement);
    if (n === 1) {
      let menuElement = document.createElement('ul');
      this.addClass('menu', menuElement);
      this.class('tabs').append(menuElement);

      this.addClass(['tab--available', 'tab--active'], menuItemElement);
      this.removeClass('tab--disabled', menuItemElement)
    }
    menuItemElement.innerText = `${this.Lang['step']} ${n}`;
    this.class('menu').append(menuItemElement);
  }

  createPage(n) {
    let pageElement = document.createElement('div');
    this.addClass(['content__page', `content__page--${n}`], pageElement);

    if (n === 1) {
      this.addClass('page--active', pageElement);
    }

    this.class('content').append(pageElement);

    for (let i = 1; i <= this.Inputs[i - 1].length; i++) {
      let rowElement = this.createElement('div', 'row', pageElement);
      let cellLeftElement = this.createElement('div','cell', rowElement);
      let cellRightElement = this.createElement('div','cell', rowElement);
      this.createElement('div','validation', cellLeftElement);
      let inputContainerElement = this.createElement('div','input-container', cellLeftElement);

      let labelElement = this.createElement('label', 'input-label', cellRightElement);
      labelElement.setAttribute('for', this.Inputs[n - 1][i - 1].inputId);
      labelElement.innerText = this.Lang.inputs[this.Inputs[n - 1][i - 1].inputId];

      inputContainerElement.append((this.Inputs[n - 1][i - 1]).create());
      this.createElement('span','input-error', inputContainerElement);

      this.class(`content__page--${n}`).append();
    }
    let lastRowElement = this.createElement('div', ['row', 'row--one-element'], pageElement);
    let nextStepButton = this.createElement('button', ['button', 'button--next-step'], lastRowElement);
    nextStepButton.innerText = this.Lang['proceed'];
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
    let phoneNumberInput = this.id('phone-number');
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
      (date[0] > 30 && [4, 6, 9, 11].includes(date[1])) ||
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
    if (className.length && typeof className === 'object') {
      className.map(name => {
        element.classList.add(name);
      });
    } else {
      element.classList.add(className);
    }
  }

  removeClass(className, element) {
    element.classList.remove(className);
  }

  hasClass(className, element) {
    return element.classList.contains(className);
  }

  showElement(element) {
    element.style.display = 'block';
  }

  hideElement(element) {
    element.style.display = 'none';
  }

  createElement(tagName, className, parentElement) {
    let element = document.createElement(tagName);
    this.addClass(className, element);
    if (typeof parentElement === 'string') {
      this.class(parentElement).append(element);
    } else {
      parentElement.append(element);
    }
    return element;
  }
}

(new Form).init();
