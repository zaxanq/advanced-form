class Form {
  init() {
    this.step = 1;
    this.stepCount = 5;
    this.registerElements();
    this.setStep();
    this.initValidators();
  }

  registerElements() {
    this.tabs = this.class('tab', false);
    this.pages = this.class('content__page', false);
    this.setTabClicks();
  }

  // -------------------- Tabs -------------------- //
  setTabClicks() {
    for (let i = 0; i < this.tabs.length; i++) {
      this.tabs[i].addEventListener('click', () => {
        if (this.allowStepChange(i)) {
          this.changeStep(i + 1);
        }
      });
    }
  }

  allowStepChange(i) {
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
    for (let i = this.step + 1; i < this.stepCount; i++) {
      if (!this.hasClass('tab--available', this.tabs[i])) {
        this.addClass('tab--disabled', this.tabs[i]);
      }
    }
    if (this.step < this.stepCount) {
      this.addClass('tab--available', this.tabs[this.step]);
    }
    this.addClass('tab--active', this.tabs[this.step - 1]);
    this.addClass('page--active', this.pages[this.step -1]);
  }

  changeStep(step) {
    this.step = step;
    this.setStep();
  }

  // -------------------- Content -------------------- //

  initValidators() {
    this.textInputs = this.class('input--text', false);

    [...this.textInputs].map(input => {
      let validator = input.nextElementSibling;
      input.addEventListener('input', () => {
        if (this.validateInputs(input)) {
          this.addClass('validation--invalid', validator);
          this.removeClass('validation--valid', validator);
        } else {
          this.removeClass('validation--invalid', validator);
          this.addClass('validation--valid', validator);
        }
      });
    })
  }

  validateInputs(input) {
    if (!input.checkValidity()) return false;
    return true;
  }

  // -------------------- Helpful methods -------------------- //
  class(className, firstOnly = true) {
    let elements = document.getElementsByClassName(className);
    return firstOnly ? elements[0] : elements;
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
