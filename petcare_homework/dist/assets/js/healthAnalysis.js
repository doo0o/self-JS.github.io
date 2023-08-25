class HealthAnalysis {
  constructor(params) {
    this.wrap = document.querySelector(Util.returnRef(params.wrap));
    this.btnBack = this.wrap.querySelector(params.btnBack);
    this.btnBackClone = this.btnBack.cloneNode();
    this.btnNext = this.wrap.querySelector(Util.returnRef(params.btnNext));
    this.btnClose = (params.btnClose) ? this.wrap.querySelector(params.btnClose) : null;
    this.container = this.wrap.querySelector(Util.returnRef(params.container));
    this.step = 0;
    this.petName = null;
    this.defaultTxt = "(이)가 자주 보이는 행동이나 습관을​ 모두 선택해주세요."
    this.data = params.data;
    this.renderTime = 500;
    this.renderState = false;
    this.renderTimer;
    this.startTimer;
    this.chkResetStr = "없어요.";
    this.cancelCallBack = null;
    this.completeCallBack = null;
    this.stepValue = {};
    this.value = {}
  }
  start(petName) {
    this.btnBackClone.removeAttribute('onclick');
    this.wrap.classList.add('isStart');
    this.btnBack.hidden = true;
    this.petName = petName;
    this.startTimer = setTimeout(()=>{
      this.wrap.classList.add('isProgress');
      this.next();
    }, this.renderTime);
    this.btnNext.addEventListener('click',()=>this.next());
    this.btnNext.disabled = true;
    this.btnBackClone.textContent = '뒤로가기'
    this.btnBackClone.addEventListener('click', ()=>this.prev());
    this.btnBack.parentNode.insertAdjacentElement('beforeend', this.btnBackClone);
    if(this.btnClose) this.btnClose.addEventListener('click',()=>this.cancelCallBack(this));
  }
  goto(num, petName) {
    this.step = num;
    this.start(petName);
  }
  next() {
    clearTimeout(this.startTimer);
    if(this.step > 0) this.value[`step${this.step}`] = this.stepValue;
    if(this.renderState == false && this.step < this.data.length) {
      this.step++;
      this.container.textContent = '';
      this.renderState = true;
      this.renderStep(this.data[this.step - 1]);
      this.btnNext.disabled = true;
      this.btnNextDisabledFunc();
    } else if (this.step == this.data.length) {
      this.completeCallBack(this);
    }
  }
  prev() {
    clearTimeout(this.startTimer);
    if(this.renderState == false) {
      this.container.textContent = '';
      this.renderState = true;
      if(this.step > 1) {
        this.step--;
        this.renderStep(this.data[this.step - 1]);
        this.btnNextDisabledFunc();
      } else {
        this.step = 0;
        this.wrap.classList.remove('isStart');
        this.wrap.classList.remove('isProgress');
        this.btnBack.hidden = false;
        this.btnBackClone.remove();
        this.renderTimer = setTimeout(()=>{
          this.renderState = false;
        }, this.renderTime);
      }
    }
  }
  renderStep(data) {
    clearTimeout(this.renderTimer);
    (this.value[`step${this.step}`]) ? this.stepValue = this.value[`step${this.step}`] : this.stepValue = {};
    this.btnNext.innerHTML = `다음 <span class="step">(${this.step}/${this.data.length})</span>`;
    let elObj = {};
    elObj["title"] = this.createTitle(data.title);
    if(data.sub) {
      data.sub.forEach((sub, idx)=>{
        elObj[`txt${idx}`] = this.createTxt(sub.txt);
        const option = {
          "item": (sub.chk) ? sub.chk : sub.radio,
          "idx": idx,
          "input": (sub.chk) ? 'chk' : 'radio',
          "type": (sub.type) ? sub.type : null,
          "column": (sub.column) ? sub.column: null,
          "desc": (sub.inputDesc) ? sub.inputDesc : null,
          "val" : (this.value[`step${this.step}`]) ? this.value[`step${this.step}`][`val${idx}`] : null
        }
        if(!this.value[`step${this.step}`]) this.stepValue[`val${idx}`] = [];
        if(sub.chk) elObj[`chk${idx}`] = this.createChk(option);
        if(sub.radio) elObj[`radio${idx}`] = this.createChk(option);
      });
    } else {
      elObj["txt"] = this.createTxt((data.txt) ? data.txt : this.defaultTxt);
      const option = {
        "item": (data.chk) ? data.chk : data.radio,
        "input": (data.chk) ? 'chk' : 'radio',
        "type": (data.type) ? data.type : null,
        "column": (data.column) ? data.column: null,
        "desc": (data.inputDesc) ? data.inputDesc : null,
        "val" : (this.value[`step${this.step}`]) ? this.value[`step${this.step}`]["val0"] : null
      }
      if(!this.value[`step${this.step}`]) this.stepValue['val0'] = [];
      if(data.chk) elObj["chk"] = this.createChk(option);
      if(data.radio) elObj["radio"] = this.createChk(option);
    }
    for(let key in elObj) {
      this.container.insertAdjacentElement('beforeend', elObj[key]);
    }
    this.renderTimer = setTimeout(()=>{
      this.renderState = false;
    }, this.renderTime);
  }
  createTitle(str) {
    const title = document.createElement('h2');
    title.classList.add('analysis--title');
    title.innerText = str;
    return title;
  }
  createTxt(str) {
    const txt = document.createElement('p');
    txt.classList.add('analysis--txt');
    txt.innerHTML = `<strong class="colorPrimary">${this.petName}</strong>${str}`;
    return txt;
  }
  createChk(params) {
    const ul = document.createElement('ul');
    console.log(params);
    if(params.val) {
      params.val.forEach(val=>{
        params.item.forEach(item=>{
          if(item.id === val && item.txt === this.chkResetStr) ul.classList.add('isChecked');
        })
      });
    }
    switch(params.type) {
      case 'box': {
        ul.classList.add('analysis__type-box');
        if(params.column) ul.classList.add(`type-column${params.column}`);
        break;
      }
      default : {
        ul.classList.add('analysis__type-list');
      }
    }
    params.item.forEach(el => {
      const li = document.createElement('li');
      li.insertAdjacentHTML('beforeend', 
        this.createChkList({
          "item": el.txt,
          "id": el.id,
          "idx": params.idx,
          "input": params.input,
          "type": params.type,
          "desc": (el.desc) ? el.desc : null,
          "val": params.val
        })
      );
      li.querySelector('input').addEventListener('click', _this=>{
        this.chkFunc(_this, ul, params.idx);
      })
      ul.insertAdjacentElement('beforeend', li);
    });
    return ul;
  }
  createChkList(params) {
    let checked = false;
    if(params.val) {
      params.val.forEach(_this=>{
        if(_this === params.id) checked = true;
      })
    }
    let radioName = (params.idx) ? `analysisRadio${params.idx}`:'analysisRadio';
    const inputEl = 
      (params.input === 'radio') 
      ? `<input type="radio" id="${params.id}" name="${radioName}" value="${params.id}" ${(checked) ? 'checked' : ''} />` 
      : `<input type="checkbox" id="${params.id}" value="${params.id}" ${(checked) ? 'checked' : ''} ${(params.item === this.chkResetStr) ? 'class="isNone"' : null} />`;
    const inputDesc = (params.desc) ? `<span class="desc">${params.desc}</span>` : '';
    switch(params.type) {
      case 'box': {
        return `
          <label class="base-chk">
            ${inputEl}
            <span class="base-btn type2-l">${params.item}</span>
          </label>
        `;
      }
      default: {
        return `
          <label class="input-chk">
            ${inputEl}
            <span>${params.item}${inputDesc}</span>
          </label>
        `;
      }
    }
  }
  chkFunc(_this, wrap, idx) {
    let keyName = (idx) ? `val${idx}` : `val0`;
    this.stepValue[keyName] = [];
    if(_this.target.classList.contains('isNone')) {
      (_this.target.checked) 
      ? wrap.classList.add('isChecked')
      : wrap.classList.remove('isChecked');
      wrap.querySelectorAll('input').forEach(el=>{
        if(!el.classList.contains('isNone')) el.checked = false;
        if(el.checked == true) {
          this.stepValue[keyName].push(el.value);
          this.stepValue['isNone'] = true;
        }
      });
    } else {
      wrap.classList.remove('isChecked');
      this.stepValue['isNone'] = false;
      wrap.querySelectorAll('input').forEach(el=>{
        if(el.classList.contains('isNone')) el.checked = false;
        if(el.checked == true) this.stepValue[keyName].push(el.value);
      });
    }
    this.btnNextDisabledFunc();
  }
  btnNextDisabledFunc() {
    for(const property in this.stepValue) {
      if(this.stepValue[property].length === 0) {
        this.btnNext.disabled = true;
        break;
      } else {
        this.btnNext.disabled = false;
      }
    }
  }
  onCancel(callBack) {this.cancelCallBack = callBack;}
  onComplete(callBack) {this.completeCallBack = callBack;}
}