class Form {
  init() {
    this.step = 1;
    this.stepCount = 5;
    this.registerElements();
    this.disableStepChange();
    this.setStep();
    this.initValidators();
    this.Data = {};
  }

  registerElements() {
    this.tabs = this.class('tab', false);
    this.pages = this.class('content__page', false);
    this.nextStepButtons = this.class('button--next-step', false);
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
    }
    for (let i = this.step; i < this.stepCount; i++) {
      if (!this.hasClass('tab--available', this.tabs[i])) {
        this.addClass('tab--disabled', this.tabs[i]);
      }
    }
    if (this.step < this.stepCount) {
      this.addClass('tab--available', this.tabs[this.step]);
    }
    this.addClass('tab--active', this.tabs[this.step - 1]);
    this.addClass('page--active', this.pages[this.step - 1]);
  }

  changeStep(step) {
    this.step = step;
    this.setStep();
  }

  // -------------------- Content -------------------- //

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
          if (this.checkStepInputs(this.step)) {
            this.allowStepChange();
          } else {
            // this.disableStepChange();
            // Commented to style "Proceed" button easier.
            // TODO: style "Proceed" button
          }
        } else {
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
    this.Data[input.id] = input.value;
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
    } else if (input.id === 'password') {
      if (!input.checkValidity()) {
        return {result: false, reason: 'Password is too short.'}
      }
      if ((new RegExp(/(\w)\1{2}/)).test(input.value)) {
        return {result: false, reason: 'Password cannot have 3 same characters in a row.'}
      }
    } else if (input.id === 'repeat-password') {
      if (input.value !== this.Data.password) {
        return {result: false, reason: 'Passwords cannot be different.'}
      }
    }
    return {result: true, reason: ''};
  }

  renderInputError(container, reason) {
    container.innerText = reason;
  }

  checkStepInputs(step) {
    if (step === 1) {
      if (this.checkInputs(['username', 'email', 'password', 'repeat-password'])) {
        return true;
      }
    } else if (step === 2) {
      return true;
    } else if (step === 3) {
      return true;
    } else if (step === 4) {
      return true;
    }
    return false;
  }

  checkInputs(inputs) {
    for (let i = 0; i < inputs.length; i++) {
      if (!this.id(inputs[i]).value || this.id(inputs[i]).value === '' || !this.validateInput(this.id(inputs[i]))) {
        return false;
      }
    }
    return true;
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
}

(new Form).init();
