class InputPinNumber {
  constructor(params) {
    this.wrap = document.querySelector(Util.returnRef(params.wrap));
    this.passwordWrap = this.wrap.querySelector(Util.returnRef('pinNumberPassword'));
    this.numberBox = this.passwordWrap.querySelector(Util.returnRef('pinNumberBox'));
    this.numberItem = this.numberBox.querySelectorAll('.item');
    this.keypad = this.wrap.querySelector(Util.returnRef('pinNumberKeypad'));
    this.passwordLength = 6;
    this.errorChk = 5;
    this.password = [];
    this.confirmCallBack = null;
    this.init();
  }
  init() {
    this.createKeypad();
  }
  reset() {
    this.password = [];
    this.keypad.textContent = '';
    this.createKeypad();
    this.numberItem.forEach(_this=>_this.classList.remove('isActive'));
  }
  createKeypad() {
    const numbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const result = [];
    
    while (result.length < 10) {
      const randomIndex = Math.floor(Math.random() * numbers.length);
      const randomNumber = numbers[randomIndex];
      result.push(randomNumber);
      numbers.splice(randomIndex, 1);
    }
    result.forEach(_this=>{
      const button = document.createElement('button');
      button.classList.add('number');
      button.innerText = _this;
      button.addEventListener('click',()=>this.inputPassword(_this))
      this.keypad.insertAdjacentElement('beforeend', button);
    });
    this.createDel();
  }
  createDel() {
    const button = document.createElement('button');
    button.classList.add('del');
    button.addEventListener('click',()=>this.delPassword());
    this.keypad.insertAdjacentElement('beforeend', button);
  }
  inputPassword(number) {
    if(this.passwordWrap.classList.contains('isError')) this.passwordWrap.classList.remove('isError');
    if(this.password.length < this.passwordLength) {
      this.password.push(number);
      for(let idx = 0; idx < this.password.length; idx++) {
        this.numberItem[idx].classList.add('isActive');
      }
    }
    if(this.password.length == this.passwordLength && this.confirmCallBack) this.confirmCallBack(this);
  }
  delPassword() {
    if(this.password.length > 0) {
      this.password.splice(this.password.length - 1, 1);
      this.numberItem[this.password.length].classList.remove('isActive');
    }
  }
  onConfirm(callBack) {
    this.confirmCallBack = callBack;
  }
}