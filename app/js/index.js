class Form {
  init() {
    this.step = 2;
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
      errors: {
        'required-input': 'To pole jest obowiązkowe.',
        username: {
          'too-short': 'Nazwa jest za krótka.',
          'first-char': 'Nazwa musi zaczynać się literą lub cyfrą.',
          'unallowed-chars': 'Nazwa zawiera niedozwolone znaki.',
          'last-char': 'Nazwa musi kończyć się literą lub cyfrą.'
        },
        email: {
          'invalid-format': 'Niepoprawny format adresu email.',
          'first-char': 'Adres musi zaczynać się literą lub cyfrą.'
        },
        password: {
          'too-short': 'Hasło jest za krótkie.',
          'three-chars': 'Hasło nie może zawierać trzech identycznych znaków pod rząd.',
          'like-username': 'Hasło nie może być podobne do nazwy użytkownika',
          'like-email': 'Hasło nie może być podobne od adresu email',
          'different': 'Hasła nie mogą się różnić'
        },
        phoneNumber: {
          'only-digits': 'Numer telefonu może zawierać tylko cyfry',
          'invalid-format': 'Nieprawidłowy numer telefonu'
        },
        firstName: {
          'unallowed-chars': 'Imię i nazwisko może zawierać tylko litery, spację, apostrof lub myślnik.'
        },
        birthDate: {
          'invalid-format': 'Nieprawidłowy format daty'
        }
      }
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

    this.InputElementsObject = {};
    this.InputElementsArray = [];
    for (let i = 0; i < this.Inputs.length; i++) {
      this.InputElementsObject[i + 1] = {};
      for (let j = 0; j < this.Inputs[i].length; j++) {
        this.InputElementsObject[i + 1][this.Inputs[i][j].inputId] = (this.Inputs[i][j].create());
        this.InputElementsArray.push(this.Inputs[i][j].create());
      }
    }
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
      let cellLeftElement = this.createElement('div', 'cell', rowElement);
      let cellRightElement = this.createElement('div', 'cell', rowElement);
      this.createElement('div', 'validation', cellLeftElement);
      let inputContainerElement = this.createElement('div', 'input-container', cellLeftElement);

      let labelElement = this.createElement('label', 'input-label', cellRightElement);
      labelElement.setAttribute('for', this.Inputs[n - 1][i - 1].inputId);
      labelElement.innerText = this.Lang.inputs[this.Inputs[n - 1][i - 1].inputId];

      inputContainerElement.append(this.InputElementsObject[n][labelElement.getAttribute('for')]);
      this.createElement('span', 'input-error', inputContainerElement);
    }
    let lastRowElement = this.createElement('div', ['row', 'row--one-element'], pageElement);
    let nextStepButton = this.createElement('button', ['button', 'button--next-step'], lastRowElement);
    nextStepButton.innerText = this.Lang['proceed'];
  }

  registerElements() {
    this.tabs = this.class('tab', false);
    this.pages = this.class('content__page', false);

    this.DOMInputs = this.class('input--text', false);
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
    this.checkStepInputs() ? this.allowStepChange() : this.disableStepChange();
    for (let i = 0; i < this.stepCount; i++) {
      this.removeClass('tab--active', this.tabs[i]);
      this.removeClass('page--active', this.pages[i]);
      this.removeClass('tab--disabled', this.tabs[i]);
      this.hideElement(this.pages[i]);
    }
    if (this.step > this.stepCount) {
      this.class('content').innerText = 'koniec';
    } else {
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
  }

  // -------------------- Content -------------------- //

  addRequireMarks() {
    [...this.DOMInputs].map((inputElement, index) => {
      if (this.InputElementsArray[index].required) {
        this.addClass('required', inputElement.parentNode);
      }
    });
  }

  initPhoneNumberInput() {
    let DOMPhoneNumberInput = this.id('phone-number');
    DOMPhoneNumberInput.value = '+48';
    DOMPhoneNumberInput.addEventListener('input', function () {
      if (!this.value.startsWith('+48')) {
        this.value = '+48';
      }
    });
  }

  initValidators() {
    [...this.DOMInputs].map(input => {
      let validator = input.parentElement.previousElementSibling;
      let errorContainer = input.nextElementSibling;
      input.addEventListener('input', () => {
        let validation = this.validateInput(input);
        if (validation.result) {
          this.removeClass('validation--invalid', validator);
          this.addClass('validation--valid', validator);
          this.renderInputError(errorContainer, '');
          if (this.checkStepInputs()) {
            if (input.id === 'password' || input.id === 'repeat-password') {
              let secondPWInput;
              if (input.id === 'password') {
                secondPWInput = this.id('repeat-password');
              } else {
                secondPWInput = this.id('password');
              }
              this.removeClass('validation--invalid', secondPWInput.parentElement.previousElementSibling);
              this.addClass('validation--valid', secondPWInput.parentElement.previousElementSibling);
              this.renderInputError(secondPWInput.nextElementSibling, '');
              this.validateInput(this.id('repeat-password'));
            }
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
    if (input.value === '' && input.required) {
      return {result: false, reason: this.Lang.errors['required-input']}
    }
    if (input.id === 'username') {
      if (!input.checkValidity()) {
        return {result: false, reason: this.Lang.errors.username['too-short']}
      }
      if (!(new RegExp(/^[a-zA-Z0-9]/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.username['first-char']};
      }
      if (!(new RegExp(/^([a-zA-Z0-9.\-_@$^*]*)$/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.username['unallowed-chars']}
      }
      if (!(new RegExp(/[a-zA-Z0-9]$/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.username['last-char']};
      }
    } else if (input.id === 'email') {
      if (!input.checkValidity()) {
        return {result: false, reason: this.Lang.errors.email['invalid-format']}
      }
      if (!(new RegExp(/^[a-zA-Z0-9]/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.email['first-char']};
      }
    } else if (input.id === 'password' || input.id === 'repeat-password') {
      let passwordInput = this.id('password');
      let retypepwInput = this.id('repeat-password');

      if (!passwordInput.checkValidity()) {
        return {result: false, reason: this.Lang.errors.password['too-short']}
      }
      if ((new RegExp(/(\w)\1{2}/)).test(passwordInput.value)) {
        return {result: false, reason: this.Lang.errors.password['three-chars']}
      }
      if (passwordInput.value.toLowerCase() === this.Data.username.toLowerCase() ||
        passwordInput.value.toLowerCase().includes(this.Data.username.toLowerCase())) {
        return {result: false, reason: this.Lang.errors.password['like-username']}
      }
      if (typeof retypepwInput.value !== 'undefined' && retypepwInput.value !== '') {
        if (passwordInput.value !== retypepwInput.value) {
          return {result: false, reason: this.Lang.errors.password['different']}
        }
      }
      let valueLC = input.value.toLowerCase();
      let emailLC = this.Data.email.toLowerCase();
      if (valueLC === emailLC ||
        (emailLC !== '' && valueLC.includes(emailLC.slice(0, emailLC.indexOf('@'))))) {
        return {result: false, reason: this.Lang.errors.password['like-email']}
      }
    } else if (input.id === 'repeat-password') {
      if (input.value !== this.Data.password) {
        return {result: false, reason: this.Lang.errors.password['different']}
      }
    } else if (input.id === 'phone-number') {
      if (!(new RegExp(/^[0-9+]+$/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.phoneNumber['only-digits']}
      }
      if (input.value.length < 12 && input.value.length > 3) {
        return {result: false, reason: this.Lang.errors.phoneNumber['invalid-format']}
      }
    } else if (input.id === 'first-name' || input.id === 'last-name') {
      if (!(new RegExp(/^[a-zA-Z '\-]*$/)).test(input.value) && input.value !== '') {
        return {result: false, reason: this.Lang.errors.firstName['unallowed-chars']}
      }
    } else if (input.id === 'birth-date') {
      if (input.value !== '' && (!input.checkValidity() ||
        !(new RegExp(/^([0-9]{2})+\.+([0-9]{2})+\.+[0-9]{4}/)))
        .test(input.value)) {
        return {result: false, reason: this.Lang.errors.birthDate['invalid-format']}
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
    let inputIds = this.InputElementsArray.map(input => input.id);

    if (this.checkInputs(inputIds.slice(4 * (this.step - 1), 4 * this.step))) {
      console.log(this.checkInputs(inputIds.slice(4 * (this.step - 1), 4 * this.step)));
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
  }

  allowStepChange() {
    if (this.step - 1 < this.stepCount) {
      this.nextStepButtons[this.step - 1].disabled = false;
    }
  }

  disableStepChange() {
    if (this.step - 1 < this.stepCount) {
      this.nextStepButtons[this.step - 1].disabled = true;
    }
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
