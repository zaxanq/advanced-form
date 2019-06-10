class Form {
  init() {
    this.step = 1;
    this.stepCount = 5;

    this.evilCorp = 'Evilcorp.';
    this.Lang = {
      step: 'Krok',
      proceed: 'Dalej',
      confirmButton: 'Potwierdzam',
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
        requiredInput: 'To pole jest obowiązkowe.',
        username: {
          tooShort: 'Nazwa jest za krótka.',
          firstChar: 'Nazwa musi zaczynać się literą lub cyfrą.',
          unallowedChars: 'Nazwa zawiera niedozwolone znaki.',
          lastChar: 'Nazwa musi kończyć się literą lub cyfrą.'
        },
        email: {
          invalidFormat: 'Niepoprawny format adresu email.',
          firstChar: 'Adres musi zaczynać się literą lub cyfrą.'
        },
        password: {
          tooShort: 'Hasło jest za krótkie.',
          threeChars: 'Hasło nie może zawierać trzech identycznych znaków pod rząd.',
          likeUsername: 'Hasło nie może być podobne do nazwy użytkownika',
          likeEmail: 'Hasło nie może być podobne od adresu email',
          different: 'Hasła nie mogą się różnić'
        },
        phoneNumber: {
          onlyDigits: 'Numer telefonu może zawierać tylko cyfry',
          invalidFormat: 'Nieprawidłowy numer telefonu'
        },
        firstName: {
          unallowedChars: 'Imię i nazwisko może zawierać tylko litery, spację, apostrof lub myślnik.'
        },
        birthDate: {
          invalidFormat: 'Nieprawidłowy format daty'
        }
      },
      confirmPage: {
        pleaseConfirm: 'Potwierdź poniższe dane',
        noData: 'brak informacji',
        hidden: 'ukryte'
      },
      endTab: 'Dziękujemy za wypełnienie formularza',
      endPage: {
        heading: 'Dziękujemy!',
        thisIsAll: 'To już wszystko. Proces rejestracji jest już prawie zakończony.',
        confirmRegistration: 'Prosimy o potwierdzenie rejestracji poprzez kliknięcie w odnośnik w wysłanej na podany adres wiadomości email.',
        activeFor: 'Pamiętaj, że link aktywacyjny będzie dostępny tylko przez najbliższe 12 godzin. Po tym czasie konto zostanie usunięte.',
        seeYou: 'Do zobaczenia w serwisie,'
      }
    };

    this.idList = {
      username: 'username',
      email: 'email',
      password: 'password',
      repeatPassword: 'repeat-password',
      firstName: 'first-name',
      lastName: 'last-name',
      phoneNumber: 'phone-number',
      birthDate: 'birth-date',
      addressCity: 'address-city',
      addressZip: 'address-zip',
      addressStreet: 'address-street',
      addressBuilding: 'address-building',
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
    let Input = function Input(id, minlength, maxlength, placeholder, type, required = false) {
      this.inputId = id;
      this.minlen = minlength;
      this.maxlen = maxlength;
      this.placeholder = placeholder;
      this.type = type;
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
        new Input(this.idList.username, 4, 16, 'JanKow', 'text', true),
        new Input(this.idList.email, 4, 128, 'jan.kowalski@gmail.com', 'email', true),
        new Input(this.idList.password, 6, 32, 'hasło123', 'password', true),
        new Input(this.idList.repeatPassword, 6, 32, 'hasło123', 'password', true),
      ],
      [
        new Input(this.idList.firstName, 2, 32, 'Jan', 'text', true),
        new Input(this.idList.lastName, 0, 32, 'Kowalski', 'text'),
        new Input(this.idList.phoneNumber, 0, 12, '+48123456789', 'text'),
        new Input(this.idList.birthDate, 10, 32, '31.12.1970', 'text'),
      ],
      [
        new Input(this.idList.addressCity, 2, 32, 'Warszawa', 'text', true),
        new Input(this.idList.addressZip, 0, 6, '00-000', 'text'),
        new Input(this.idList.addressStreet, 0, 32, 'Katowicka', 'text'),
        new Input(this.idList.addressBuilding, 0, 32, '25/4A', 'text'),
      ],
      [
        new Input('012', 0, 32, 'Warszawa', 'text'),
        new Input('034', 0, 32, '00-000', 'text'),
        new Input('056', 0, 32, 'Katowicka', 'text'),
        new Input('078', 0, 32, '25/4A', 'text')
      ],
      [
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
    menuItemElement.innerText = `${this.Lang.step} ${n}`;
    this.class('menu').append(menuItemElement);
  }

  createPage(n) {
    let pageElement = document.createElement('div');
    this.addClass(['content__page', `content__page--${n}`], pageElement);

    if (n === 1) {
      this.addClass('page--active', pageElement);
    }

    this.class('content').append(pageElement);

    if (n < this.stepCount) {
      for (let i = 1; i <= this.Inputs[i - 1].length; i++) {
        this.createInputPage(pageElement, n, i);
      }
      this.createNextStepButton(pageElement);
    } else {
      this.createConfirmPage(pageElement);
      this.createNextStepButton(pageElement, true);
    }
  }

  createNextStepButton(pageElement, confirmButton = false) {
    let lastRowElement = this.createElement('div', ['row', 'row--one-element'], pageElement);
    let nextStepButton = this.createElement('button', ['button', 'button--next-step'], lastRowElement);
    confirmButton ? nextStepButton.innerText = this.Lang.confirmButton : nextStepButton.innerText = this.Lang.proceed;
  }

  createInputPage(pageElement, n, i) {
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

  createConfirmPage(pageElement) {
    let rowElement = this.createElement('div', 'row', pageElement);
    rowElement.innerText = this.Lang.confirmPage.pleaseConfirm;
    for (let i = 0; i < this.InputElementsArray.length; i++) {
      let dataRow = this.createElement('div', ['row', 'row--confirm-page'], pageElement);
      let cellLeftElement = this.createElement('div', 'cell', dataRow);
      cellLeftElement.innerText = this.Lang.inputs[this.InputElementsArray[i].id];
    }
  }

  fillConfirmPage() {
    for (let i = 0; i <this.InputElementsArray.length; i++) {
      let cellRightElement = this.createElement('div', 'cell', this.class('row--confirm-page', false)[i]);
      if (this.InputElementsArray[i].id === this.idList.password || this.InputElementsArray[i].id === this.idList.repeatPassword) {
        cellRightElement.innerHTML = `<span class="italic blank">${this.Lang.confirmPage.hidden}</span>`;
      }
      else if (this.InputElementsArray[i].id === this.idList.phoneNumber && typeof this.Data[this.InputElementsArray[i].id] !== 'undefined') {
        console.log(this.Data[this.InputElementsArray[i].id], this.Data[this.InputElementsArray[i].id].length);
        cellRightElement.innerHTML = this.Data[this.InputElementsArray[i].id].length <= 3 ? `<span class="italic blank">${this.Lang.confirmPage.noData}</span>` : this.Data[this.InputElementsArray[i].id];
      } else {
        cellRightElement.innerHTML = typeof this.Data[this.InputElementsArray[i].id] === 'undefined' ? `<span class="italic blank">${this.Lang.confirmPage.noData}</span>` : this.Data[this.InputElementsArray[i].id];
      }
    }
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
    if (this.step === this.stepCount) {
      this.fillConfirmPage();
    }
    if (this.step > this.stepCount) {
      this.showEndpage();
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
    let DOMPhoneNumberInput = this.id(this.idList.phoneNumber);
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
            if (input.id === this.idList.password || input.id === this.idList.repeatPassword) {
              let secondPWInput;
              if (input.id === this.idList.password) {
                secondPWInput = this.id(this.idList.repeatPassword);
              } else {
                secondPWInput = this.id(this.idList.password);
              }
              this.removeClass('validation--invalid', secondPWInput.parentElement.previousElementSibling);
              this.addClass('validation--valid', secondPWInput.parentElement.previousElementSibling);
              this.renderInputError(secondPWInput.nextElementSibling, '');
              this.validateInput(this.id(this.idList.repeatPassword));
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
    if (input.id === this.idList.firstName || input.id === this.idList.lastName) {
      input.value = input.value.charAt(0).toUpperCase() + input.value.slice(1);
    }
    if (input.value !== '' || (input.id === this.idList.phoneNumber && input.value !== '+48')) {
      this.Data[input.id] = input.value;
    }
  }

  validateInput(input) {
    if (input.value === '' && input.required) {
      return {result: false, reason: this.Lang.errors.requiredInput}
    }
    if (input.id === this.idList.username) {
      if (!input.checkValidity()) {
        return {result: false, reason: this.Lang.errors.username.tooShort}
      }
      if (!(new RegExp(/^[a-zA-Z0-9]/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.username.firstChar};
      }
      if (!(new RegExp(/^([a-zA-Z0-9.\-_@$^*]*)$/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.username.unallowedChars}
      }
      if (!(new RegExp(/[a-zA-Z0-9]$/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.username.lastChar};
      }
    } else if (input.id === this.idList.email) {
      if (!input.checkValidity()) {
        return {result: false, reason: this.Lang.errors.email.invalidFormat}
      }
      if (!(new RegExp(/^[a-zA-Z0-9]/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.email.firstChar};
      }
    } else if (input.id === this.idList.password || input.id === this.idList.repeatPassword) {
      let passwordInput = this.id(this.idList.password);
      let retypepwInput = this.id(this.idList.repeatPassword);

      if (!passwordInput.checkValidity()) {
        return {result: false, reason: this.Lang.errors.password.tooShort}
      }
      if ((new RegExp(/(\w)\1{2}/)).test(passwordInput.value)) {
        return {result: false, reason: this.Lang.errors.password.threeChars}
      }
      if (passwordInput.value.toLowerCase() === this.Data.username.toLowerCase() ||
        passwordInput.value.toLowerCase().includes(this.Data.username.toLowerCase())) {
        return {result: false, reason: this.Lang.errors.password.likeUsername}
      }
      if (retypepwInput.value !== '' && passwordInput.value !== '') {
        if (passwordInput.value !== retypepwInput.value) {
          return {result: false, reason: this.Lang.errors.password.different}
        }
      }
      let valueLC = input.value.toLowerCase();
      let emailLC = this.id(this.idList.email).value.toLowerCase();
      if (valueLC === emailLC ||
        (emailLC !== '' && valueLC.includes(emailLC.slice(0, emailLC.indexOf('@'))))) {
        return {result: false, reason: this.Lang.errors.password.likeEmail}
      }
    } else if (input.id === this.idList.repeatPassword) {
      if (input.value !== this.Data.password) {
        return {result: false, reason: this.Lang.errors.password.different}
      }
    } else if (input.id === this.idList.phoneNumber) {
      if (!(new RegExp(/^[0-9+]+$/)).test(input.value)) {
        return {result: false, reason: this.Lang.errors.phoneNumber.onlyDigits}
      }
      if (input.value.length < 12 && input.value.length > 3) {
        return {result: false, reason: this.Lang.errors.phoneNumber.invalidFormat}
      }
    } else if (input.id === this.idList.firstName || input.id === this.idList.lastName) {
      if (!(new RegExp(/^[a-zA-Z '\-]*$/)).test(input.value) && input.value !== '') {
        return {result: false, reason: this.Lang.errors.firstName.unallowedChars}
      }
    } else if (input.id === this.idList.birthDate) {
      if (input.value !== '' && (!input.checkValidity() ||
        !(new RegExp(/^([0-9]{2})+\.+([0-9]{2})+\.+[0-9]{4}/))
        .test(input.value))) {
        return {result: false, reason: this.Lang.errors.birthDate.invalidFormat}
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

  showEndpage() {
    this.removeTabs();
    this.showThanks();
  }

  removeTabs() {
    [...this.tabs].map(tab => {
      tab.parentNode.removeChild(tab);
    });
    this.class('tabs').removeChild(this.class('menu'));
  }

  showThanks() {
    this.showTabThanks();
    this.showPageThanks();
  }

  showTabThanks() {
    this.createElement('div', 'tabs__endtab', 'tabs');
    this.class('tabs__endtab').innerText = this.Lang.endTab;
  }

  showPageThanks() {
    let endPage = this.createElement('div',['content__page', 'content__page--end', 'page--active'], this.class('content'));
    endPage.innerHTML =
      `<span>${this.Lang.endPage.heading}</span>
       <span>${this.Lang.endPage.thisIsAll}</span>
       <span>${this.Lang.endPage.confirmRegistration}</span>
       <span>${this.Lang.endPage.activeFor}</span>
       <span>${this.Lang.endPage.seeYou}</span>
       <span>${this.evilCorp}</span>
      `;
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
    if (this.step <= this.stepCount) {
      this.nextStepButtons[this.step - 1].disabled = false;
    }
  }

  disableStepChange() {
    if (this.step <= this.stepCount) {
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
