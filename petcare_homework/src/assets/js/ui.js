class Util {
  /**
   * 디바이스 체크
   * @returns "isMobile" or "isPC"
   */
  static deviceChk() {
    if(/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
      return 'isMobile'
    } else {
      return 'isPC'
    }
  }
  /**
   * @param {String} str 
   * @returns [data-ref="str"]
   */
  static returnRef(str) {
    return `[data-ref="${str}"]`;
  }
  /** 숫자 증감
   * @param {Object} param { start: 초기 값, total: 목표 값, time: sec, onEnd }
   */
  static numFunc(param) {
    let num = param.start;
    let timeCount = 0;
    const calcNum = (val, time) => {
      const result = val / (time * 60);
      return result;
    }
    let unit = (param.total > param.start && num < param.total) ? calcNum(param.total, param.time) : calcNum(param.start - param.total, param.time);
    let reqFunc;
    (reqFunc = () => {
      if(timeCount < param.time * 60) {
        if(param.total > param.start && num < param.total - unit) {
          num = num + unit;
        } else if(param.total < param.start && num > param.total + unit) {
          num = num - unit;
        }
        param.onEnd(num);
        window.requestAnimationFrame(reqFunc);
        timeCount++;
      } else {
        window.cancelAnimationFrame(reqFunc);
        param.onEnd(param.total);
      }
    })();
  }
  /**
   * 엘리먼트가 화면에 노출 될 때
   * @param {Element} el 
   * @param {Function} callback 
   * @param {Object} option ex: {rootMargin: '0px 0px -50px', threshold: 1.0}
   */
  static createObserver(el, callback, option) {
    const target = el;
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          if(callback) callback(entry)
        }
      });
    }, option);
    target.forEach( _this => {
      observer.observe(_this);
    })
  }

  /**
   * @returns {key: val}
   */
  static getUrlParams() {
    let params = {}
    window.location.search.replace(/[?&]+([^=&]+)=([^&]*)/gi, (str, key, value) => { params[key] = value });
    return params;
  }

  /** console.log 확인 어려울 경우 화면에 노출 용 */
  static dpConsole(str) {
    const log = document.createElement('div');
    log.style.cssText = "position:fixed;top:0;left:0;right:0;z-index:10000;background:black;color:#fff;padding:10px;text-align:center;"
    log.innerHTML = `${str}`;
    document.body.insertAdjacentElement('beforeend', log);
    setTimeout(()=>{log.remove();},1000);
  }

  /**
   * 레이어 기본 템플릿 리턴
   * @param {Object} obj {title: "레이어 타이틀", confirmStr: "확인 버튼 명칭"}
   * @returns {popup, contents, btnClose, btnConfirm}
   */
  static returnLayerTemplate(obj) {
    let eles = {}
    eles['popup'] = document.createElement('div');
    eles['popup'].classList.add('layer-popup', 'type-bot');
    eles['popup'].dataset.ref = 'layerTemp';
    eles['popup'].innerHTML = `
      <section class="popup__container">
        <div class="popup__header">
          <button class="btn-close" data-ref="layerTempClose">닫기</button>
          <h3 class="popup__title">${obj.title}</h3>
        </div>
        <div class="popup__contents" data-ref="layerTempContents">
        </div>
        ${(obj.hasOwnProperty('confirmStr')) 
          ?
          `
          <div class="btn-wrap">
            <button class="base-btn type1-xl" data-ref="layerTempConfirm">${obj.confirmStr}</button>
          </div>
          `
          : ''
        }
      </section>
    `;
    eles['contents'] = eles['popup'].querySelector(Util.returnRef('layerTempContents'));
    eles['btnClose'] = eles['popup'].querySelector(Util.returnRef('layerTempClose'));
    eles['btnConfirm'] = eles['popup'].querySelector(Util.returnRef('layerTempConfirm'));
    document.body.insertAdjacentElement('beforeend', eles['popup']);
    return eles;
  }
}

/**
 * swiper 공통 적용 함수
 * @param {Object} params {target : 슬라이더 랩, option: 슬라이더 옵션}
 * @returns swiper
 */
const slider = params => {
  const wrap = (typeof params.target === 'string') ? document.querySelector(Util.returnRef(params.target)) : params.target;
  const target = (wrap.querySelector('.swiper-container')) ? wrap.querySelector('.swiper-container') : wrap;
  const itemLeng = (params.option && params.option.slideClass) ? wrap.querySelectorAll(`.${params.option.slideClass}`).length : wrap.querySelectorAll('.swiper-slide').length;
  const paging = (wrap.querySelector('.swiper-pagination')) ? wrap.querySelector('.swiper-pagination') : null;
  const btnNav = (wrap.querySelector('.swiper-button')) ? wrap.querySelector('.swiper-button') : null;
  const pagingNumber = (wrap.querySelector('.swiper-number')) ? wrap.querySelector('.swiper-number') : null;
  const opt = (wrap.dataset.option) ? JSON.parse(wrap.dataset.option) : null;
  let pagingNumberItems = null;
  let result = {
    observer: true,
    observeParents: true,
    slidesPerView: 1,
    speed: 500,
  }
  if(opt && opt.auto) {
    const auto = {
      autoplay : {
        delay: opt.auto,
        disableOnInteraction: false,
      }
    }
    result = {...result, ...auto}
  }
  if(paging) {
    const page = {
      pagination : {
        el : paging,
        clickable : true,
      }
    }
    result = {...result, ...page}
  }
  if(btnNav) {
    const nav = {
      navigation: {
        nextEl: btnNav.querySelector('.swiper-button-next'),
        prevEl: btnNav.querySelector('.swiper-button-prev'),
      }
    }
    result = {...result, ...nav}
  }
  if(pagingNumber) {
    for(let idx = 0; idx < itemLeng; idx++) {
      pagingNumber.insertAdjacentHTML('beforeend',`<span>${idx + 1}</span>`);
    }
    pagingNumberItems = pagingNumber.querySelectorAll('span');
    pagingNumberItems[0].classList.add('current')
    const optNum = {
      on : {
        slideChange() {
          pagingNumberItems.forEach(_this => {
            _this.classList.remove('current');
          });
          pagingNumberItems[this.realIndex].classList.add('current')
        }
      }
    }
    result = {...result, ...optNum}
  }
  if(params.option) {
    result = {...result, ...params.option}
  }
  let swiper = null;
  if(itemLeng > 1) {
    return swiper = new Swiper(target, result);
  } else {
    if(btnNav) btnNav.remove();
    if(paging) paging.remove();
    if(pagingNumber) pagingNumber.remove();
    return false;
  }
}

class LayerPopup {
  /**
   * 레이어팝업
   * @param {Object} params {target: data-ref 네임, dimClose: 딤 클릭 시 숨김 처리 유무}
   */
  constructor(params) {
    this.params = params;
    this.wrap = document.querySelector(Util.returnRef(this.params.target));
    this.container = this.wrap.querySelector('.popup__container');
    this.timer = 250;
    this.state = 'hide';
    this.dimClose = (params.hasOwnProperty('dimClose') && typeof params.dimClose === 'boolean') ? false : true;
    this.showCallBack = null;
    this.hideCallBack = null;
    this.removeCallBack = null;
    this.prevLayer = false;
    this.init(params);
  }
  init() {
    if(this.dimClose === true) {
      this.wrap.addEventListener('click',e=>{
        if(e.target == this.wrap) this.hide();
      });
    }
  }
  show(callBack) {
    if(document.body.classList.contains('isLayerShow')) this.prevLayer = true;
    document.body.classList.add('isLayerShow');
    this.state = 'show';
    this.wrap.classList.add('isShow');
    setTimeout(()=>{
      this.container.classList.add('isShow');
    }, 1);
    if(callBack) callBack(this);
    if(this.showCallBack) this.showCallBack(this);
  }
  hide(callBack) {
    this.state = 'hide';
    this.container.classList.remove('isShow');
    setTimeout(()=>{
      this.wrap.classList.remove('isShow');
      if(this.prevLayer === false) document.body.classList.remove('isLayerShow');
      document.body.classList.remove('isLayerShow');
      if(this.params.target === 'layerMsg' || this.params.target === 'layerDialog') this.wrap.remove();
      if(callBack) callBack(this);
      if(this.hideCallBack) this.hideCallBack(this);
      if(this.removeCallBack) this.removeCallBack(this);
    }, this.timer);
  }
  onShow(callBack) {this.showCallBack = callBack;}
  onHide(callBack) {this.hideCallBack = callBack;}
  onRemove(callBack) {
    this.removeCallBack = callBack;
    this.wrap.remove();
  }
}

/**
 * 메시지 팝업
 * @param {Object} params {
 *  msg: 줄바꿈 == <br>,
 *  type: 'confirm', //confirm 일 경우
 *  btn: {confirm: '선택', cancel: '삭제'}, // 기본 값은 확인, 취소
 *  onConfirm: 확인 버튼 누름
 *  onCancel: 취소 버튼 누름
 *  onShow: 메시지가 보여질 때
 *  onHide: 메시지가 사라질 때
 * }
 */
const layerMsg = (params) => {
  let btn = {
    confirm: "확인",
    cancel: "취소",
    class: "",
    id: "",
  }
  if(params.btn) btn = {...btn, ...params.btn};
  const createBtn = (obj) => {
    let btns = '';
    obj.forEach((_this, idx)=>{
      btns += `<button class="base-btn ${_this.type}" data-ref="btnFunc${idx}">${_this.name}</button>`;
    });
    return btns;
  }
  const funcHide = () => {
    layerMsg.hide(params.onCancel);
    layerMsg = null;
  }

  

  const template = `
    <div class="layer-popup type-modal" data-ref="layerMsg">
      <section class="popup__container">
        ${
          (params.btnClose && params.btnClose === true) 
          ? `<button class="btn-close" data-ref="btnClose">닫기</button>`
          : ''
        }
        <div class="popup__contents">
        ${
          (params.title)? `<p class="modal__title">${params.title}</p>` : ''
        }
          <p class="txt-type">${params.msg}</p>
        </div>
        ${
          (params.customBtn) 
          ? `<div class="btn-wrap type-column">
              ${createBtn(params.customBtn)}
            </div>`
          : `<div class="btn-wrap">
              ${(params.type && params.type == 'confirm') ? `<button class="base-btn type2-m ${(btn.class) ? btn.class : ""}" data-ref="btnCancel">${btn.cancel}</button>` : ''}
              <button class="base-btn type1-m ${(btn.class) ? btn.class : ""}" data-ref="btnConfirm">${btn.confirm}</button>
            </div>`
        }
      </section>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', template);
  let layerMsg = new LayerPopup({target: "layerMsg", dimClose: false});
  layerMsg.onHide(params.onHide);
  layerMsg.show(params.onShow);
  if(params.customBtn) {
    const btns = layerMsg.wrap.querySelectorAll('.base-btn');
    params.customBtn.forEach((obj, idx)=>{
      if(btns[idx].dataset.ref === `btnFunc${idx}`) {
        btns[idx].addEventListener('click',obj.func);
      }
      if(obj.hide){
        btns[idx].addEventListener('click',()=>{
          layerMsg.hide(params.onHide)
        })
      }
    })
  } else {
    layerMsg.wrap.querySelector(Util.returnRef('btnConfirm')).addEventListener('click',()=>{
      layerMsg.hide(params.onConfirm);
      layerMsg = null;
    });
    if(params.type && params.type == 'confirm') {
      layerMsg.wrap.querySelector(Util.returnRef('btnCancel')).addEventListener('click',()=>funcHide());
    }
  }
  if(params.btnClose && params.btnClose === true) layerMsg.wrap.querySelector(Util.returnRef('btnClose')).addEventListener('click',()=>funcHide());
}
/**
 * 다이얼로그
 * @param {Object} params {
 *  msg: 줄바꿈 == <br>,
 *  timer: 2, 기본 2초 설정
 *  onShow: 다이얼로그가 보여질 때,
 *  onHide: 다이얼로그가 사라질 때,
 * }
 */
const dialog = (params) => {
  let option = {
    timer: (params.timer) ? params.timer : 2
  }
  let margin = 40;
  const template = `
    <div class="layer-popup type-dialog" data-ref="layerDialog">
      <div class="popup__container">
        <p>${params.msg}</p>
      </div>
    </div>
  `;
  document.body.insertAdjacentHTML('beforeend', template);
  let layerMsg = new LayerPopup({target: "layerDialog", dimClose: false});
  if(document.querySelector('.wrap')) {
    document.querySelector('.wrap').childNodes.forEach((_this)=>{
      if(_this.classList && (_this.classList.contains('btn-wrap') || _this.classList.contains('bot-nav'))) {
        let _thisStyle = window.getComputedStyle(_this);
        let calcNum = _thisStyle.getPropertyValue('padding-top');
        margin += _this.clientHeight - Number(calcNum.split('px')[0]); 
      }
    });
  }
  layerMsg.container.style.marginBottom = `${margin}px`;
  layerMsg.onHide(params.onHide);
  layerMsg.show(params.onShow);
  setTimeout(()=>{
    layerMsg.hide();
  }, option.timer * 1000);
}

class Select {
  /**
   * 셀렉트
   * @param {Object} params {target: button Element, data: button Element data-select}
   */
  constructor(params) {
    this.btn = params.target;
    this.defaultStr = this.btn.innerText;
    this.data = params.data;
    this.option = params.data.option;
    this.type = (this.data.hasOwnProperty('value')) ? this.data.type : null;
    this.selected = null;
    this.value = null;
    this.layer = null;
    this.confirmStr = (this.data.hasOwnProperty('btn')) ? this.data.btn : '확인';
    this.selStr = null;
    this.selTag = null;
    this.selValue = null;
    this.selClass = null;
    this.showCallBack = null;
    this.hideCallBack = null;
    this.cancelCallBack = null;
    this.btnStatus = null;
    this.confirmCallBack = null;
    this.init();
  }
  init() {
    if(this.data.hasOwnProperty('value')) {
      this.btn.classList.add('isSelected');
      this.value = this.data.value;
      this.selValue = this.data.value;
      this.option.forEach(_this=>{
        if(_this.id === this.value) {
          this.selStr = _this.name;
          this.selClass = _this.className;
        }
        if(!this.type && this.value === Object.values(_this)[0]) this.btn.innerText = Object.keys(_this)[0];
      });
    }
    this.btn.addEventListener('click', ()=>{
      this.createLayer();
    });
  }
  createLayer() {
    const layer = (this.data.btnNo)
    ?
    Util.returnLayerTemplate({
      title: this.data.title
    })
    :
    Util.returnLayerTemplate({
      title: this.data.title,
      confirmStr: this.confirmStr
    })
    if(this.data.hasOwnProperty('desc')) {
      const selectDesc = document.createElement('p');
      selectDesc.classList.add('select-desc');
      selectDesc.innerText = this.data.desc;
      layer.contents.insertAdjacentElement('beforeend', selectDesc);
    }
    const selectOption = document.createElement('ul');
    selectOption.classList.add('select-option');
    if(this.data.btnNo) selectOption.classList.add('type-btnNo')
    layer.contents.insertAdjacentElement('beforeend', selectOption);
    
    this.layer = new LayerPopup({"target": layer.popup.dataset.ref});
    this.layer.wrap.classList.add('select-wrap');
    this.layer.onShow(this.showCallBack);
    this.layer.onHide(_this=>{
      _this.onRemove(this.hideCallBack);
    });
    if(this.type === 'petSelect') selectOption.classList.add('select-option__pet');
    this.option.forEach(_this=>{
      selectOption.insertAdjacentElement('beforeend', this.createOption(_this));
    });
    this.layer.show();
    layer.btnClose.addEventListener('click',()=>{
      this.cancel();
    });
    if(!this.data.btnNo) {
      layer.btnConfirm.addEventListener('click',()=>{
        this.confirm();
      });
    }
    this.btnStatus = document.querySelector('.select-option li.selected');
    
    if(!this.btnStatus){
      let confirmBtn = document.querySelector('[data-ref="layerTempConfirm"]')
      confirmBtn.setAttribute('disabled','');
    }
  }
  createOption(obj) {
    const li = document.createElement('li');
    const btn = document.createElement('button');
    let strName;
    let val;
    let id;
    let controlTarget;
    switch(this.type) {
      case 'petSelect' : {
        btn.classList.add("pet-snippet__item", `type-${obj.className}`);
        strName = obj.name;
        val = obj.name;
        id = obj.id;
        controlTarget = id;
        btn.innerHTML = `
          <strong class="name">${val}</strong>
          <span class="type">
            <span class="age">${obj.age}살</span>
            <span class="divide">/</span>
            <span class="gender">${obj.gender}</span>
          </span>
        `
        if(this.value && this.value === id) {
          li.classList.add('selected');
          this.selTag = li;
          this.selected = li;
          console.log(li)
        }
        break;
      }
      default : {
        strName = Object.keys(obj)[0];
        val = Object.values(obj)[0];
        controlTarget = strName;
        btn.innerText = strName;
        
        if(this.value && this.value === val || this.value === id) {
          li.classList.add('selected');
          this.selTag = li;
          this.selected = li;
        }

        break;
      }
    }
    
    li.insertAdjacentElement('beforeend', btn);
    obj["tag"] = li;
    btn.addEventListener('click', ()=>{
      this.sel(controlTarget);
    });
    return li;
  }
  sel(key) {
    let strName;
    let val;
    let id;
    let className;
    let controlTarget;
    let confirmBtn = document.querySelector('[data-ref="layerTempConfirm"]');
    if(confirmBtn){
      confirmBtn.removeAttribute('disabled');
    }
    // this.btnStatus = document.querySelector('.select-option li.selected');
    // if(this.btnStatus){
    //   }
  
    for(let idx = 0; idx < this.option.length; idx++) {
      switch(this.type) {
        case 'petSelect' : {
          strName = this.option[idx].name;
          val = this.option[idx].name;
          id = this.option[idx].id;
          controlTarget = id;
          className = this.option[idx].className;
        break;
        }
        default : {
          strName = Object.keys(this.option[idx])[0];
          controlTarget = strName
          val = this.option[idx][key]
        break;
        }
      }
      if(key === controlTarget && this.selValue !== val) {
        console.log(event)
        if(event) {
          if(this.selTag !== null) this.selTag.classList.remove('selected');
          this.selTag = this.option[idx].tag;
          this.option[idx].tag.classList.add('selected');
          this.selStr = strName;
          (id) ? this.selValue = id : this.selValue = val;
          (className) ? this.selClass = className : null;
        } else {
          this.value = val;
          this.btn.classList.add('isSelected');
          if(this.type !== 'petSelect') this.btn.innerText = strName;
        }
      }
    }
    if(this.data.btnNo) this.confirm();
    return this;
  }
  confirm() {
    if(this.value !== this.selValue) {
      this.selected = this.selTag;
      this.value = this.selValue;
      if(this.type !== 'petSelect') {
        this.btn.innerText = this.selStr;
        this.btn.classList.add('isSelected');
      }
    }
    this.layer.hide();
    if(this.confirmCallBack) this.confirmCallBack(this);
  }
  cancel() {
    if(this.layer) {
      if(this.selTag) this.selTag.classList.remove('selected');
      if(this.selected) this.selected.classList.add('selected');
      this.selTag = this.selected;
      this.selValue = this.value;
      this.layer.hide();
    }
    if(this.cancelCallBack) this.cancelCallBack(this);
  }
  reset() {
    this.btn.innerText = this.defaultStr;
    this.btn.classList.remove('isSelected');
    this.value = null;
    return this;
  }
  update(arry) {
    this.reset();
    this.option = arry;
    return this;
  }
  onShow(callBack) {this.showCallBack = callBack;}
  onHide(callBack) {this.hideCallBack = callBack;}
  onCancel(callBack) {this.cancelCallBack = callBack;}
  onConfirm(callBack) {this.confirmCallBack = callBack;}
}
class Calendar {
  /**
   * 캘린더
   * @param {Object} params {target: button Element, data: button Element data-calendar}
   */
  constructor(params) {
    this.btn = params.target;
    this.data = params.data;
    this.value = (this.data.hasOwnProperty('value')) ? this.data.value : null;
    this.start = (this.data.hasOwnProperty('start')) ? this.data.start : null;
    this.end = (this.data.hasOwnProperty('end')) ? this.data.end : null;
    this.minDate = (this.data.hasOwnProperty('minDate')) ? this.data.minDate : null;
    this.maxDate = (this.data.hasOwnProperty('maxDate')) ? this.data.maxDate : null;
    this.layer = null;
    this.datepicker = null;
    this.showCallBack = null;
    this.hideCallBack = null;
    this.cancelCallBack = null;
    this.confirmCallBack = null;
    this.init();
  }
  init() {
    const weekArry = ["일", "월", "화", "수", "목", "금", "토"];
    const monthArry = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"]
    Datepicker.locales.ko = {
      days: ["일요일", "월요일", "화요일", "수요일", "목요일", "금요일", "토요일"],
      daysShort: weekArry,
      daysMin: weekArry,
      months: monthArry,
      monthsShort: monthArry,
      today: "오늘",
      clear: "삭제",
      format: "yyyy.mm.dd",
      titleFormat: "y년 mm월",
      weekStart: 0
    };
    this.option = {
      language: 'ko',
      todayHighlight: true,
      beforeShowDay: (date)=>{
        return {
          content: `<span class="inner">${date.getDate()}</span>`,
        };
      }
    }
    if(this.data.hasOwnProperty('value')) {
      this.btn.classList.add('isSelected');
      this.btn.innerText = this.value;
    }
    this.btn.addEventListener('click', ()=>{
      this.createLayer();
    });
  }
  createLayer() {
    const layer = Util.returnLayerTemplate({title: this.data.title});
    this.layer = new LayerPopup({"target": layer.popup.dataset.ref});
    this.layer.onShow(this.showCallBack);
    this.layer.onHide(_this=>_this.onRemove(this.hideCallBack));

    let now = new Date();
    let todayDate = new Intl.DateTimeFormat('ko',{
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date()).replace(/.$/, '').replace(/ /g,'');

    let beforeOneMonth = new Intl.DateTimeFormat('ko',{
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
    }).format(new Date(now.setDate(now.getDate()- 31))).replace(/.$/, '').replace(/ /g,'');
    
    let periodObj = {
      "minDate": (this.minDate) ? this.minDate : null,
      "maxDate": (this.maxDate) ? this.maxDate : null,
    }
  
    let todayStatus ;

    if(this.start || this.end) {
      periodObj = {
        "minDate": (this.start && globalCalendarObj[this.start].value) ? globalCalendarObj[this.start].value : this.minDate,
        "maxDate": (this.end && globalCalendarObj[this.end].value) ? globalCalendarObj[this.end].value : this.maxDate,
      }
    }
    if(periodObj.minDate == "beforeOneMonth"){
      periodObj.minDate = beforeOneMonth;
    }
    if(periodObj.maxDate == "todayDate"){
      periodObj.maxDate = todayDate;
    }
    let resultOPtion = {...this.option , ...periodObj}
    this.datepicker = new Datepicker(layer.contents, resultOPtion);
    if(this.value) this.datepicker.setDate(this.value);
    layer.contents.addEventListener('changeDate', _this=>{
      this.value = this.datepicker.getDate('yyyy.mm.dd');
      this.btn.innerText = this.value;
      this.layer.hide();
      if(this.confirmCallBack) this.confirmCallBack(this);
    });

    this.layer.show();
    layer.btnClose.addEventListener('click',()=>{
      this.layer.hide();
      if(this.cancelCallBack) this.cancelCallBack(this);
    });
  }
  onShow(callBack) {this.showCallBack = callBack;}
  onHide(callBack) {this.hideCallBack = callBack;}
  onCancel(callBack) {this.cancelCallBack = callBack;}
  onConfirm(callBack) {this.confirmCallBack = callBack;}
}

class TimePicker {
  /**
   * 타임피커
   * @param {Object} params {target: button Element, data: button Element data-time}
   */
  constructor(params) {
    this.btn = params.target;
    this.data = params.data;
    this.confirmStr = (this.data.hasOwnProperty('btn')) ? this.data.btn : '확인';
    this.value = (this.data.hasOwnProperty('value')) ? this.data.value : null;
    this.layer = null;
    this.selectedTime = null;
    this.slideFirst = null;
    this.slideHour = null;
    this.slideMin = null;
    this.showCallBack = null;
    this.hideCallBack = null;
    this.cancelCallBack = null;
    this.confirmCallBack = null;
    this.init();
  }
  init() {
    if(this.data.hasOwnProperty('value')) {
      this.btn.classList.add('isSelected');
      this.value = this.data.value;
      this.btn.textContent = this.value;
    }
    this.btn.addEventListener('click', ()=>{
      this.createLayer();
    });
  }
  createLayer() {
    const layer = Util.returnLayerTemplate({
      title: this.data.title,
      confirmStr: this.confirmStr
    });
    this.layer = new LayerPopup({"target": layer.popup.dataset.ref});
    this.layer.onShow(this.showCallBack);
    this.layer.onHide(_this=>_this.onRemove(this.hideCallBack));
    const timePickerWrap = document.createElement('div');
    timePickerWrap.classList.add('time-picker');
    layer.contents.insertAdjacentElement('beforeend', timePickerWrap);
    for(let itemIdx = 1; itemIdx < 4; itemIdx++) {
      let pickerSlider = this.createPicker({target: timePickerWrap, idx: itemIdx});
      switch(itemIdx) {
        case 1 : {
          this.slideFirst = slider({
            target: pickerSlider,
            option: {
              direction: "vertical"
            }
          });
          break;
        }
        case 2 : {
          this.slideHour = slider({
            target: pickerSlider,
            option: {
              direction: "vertical",
              loop: true,
              loopAdditionalSlides: 60
            }
          });
          break;
        }
        case 3 : {
          this.slideMin = slider({
            target: pickerSlider,
            option: {
              direction: "vertical",
              loop: true,
              loopAdditionalSlides: 60
            }
          });
          break;
        }
      }
    }
    this.layer.show();
    layer.btnClose.addEventListener('click',()=>{
      this.layer.hide();
      if(this.cancelCallBack) this.cancelCallBack(this);
    });
    layer.btnConfirm.addEventListener('click',()=>{
      this.confirm();
    });
  }
  createPicker(params) {
    const slider = document.createElement('div');
    const sliderWrapper = document.createElement('div');
    slider.classList.add('swiper-container');
    sliderWrapper.classList.add('swiper-wrapper');
    slider.insertAdjacentElement('beforeend', sliderWrapper);
    const sliderSort = () => {
      switch(params.idx) {
        case 1 : return 2
        case 2 : return 12
        case 3 : return 60
      }
    }
    for(let num = 0; num < sliderSort(); num++) {
      const slide = document.createElement('div');
      slide.classList.add('swiper-slide');
      switch(params.idx) {
        case 1 : {
          (num === 0) ? slide.textContent = '오전' : slide.textContent = '오후';
          break;
        }
        case 2 : {
          (num < 12) ? slide.textContent = String(num + 1).padStart(2, '0') : slide.textContent = String(num - 11).padStart(2, '0');
          break;
        }
        default : {
          slide.textContent = String(num).padStart(2, '0');
          break;
        }
      }
      sliderWrapper.insertAdjacentElement('beforeend', slide);
    }
    params.target.insertAdjacentElement('beforeend', slider);
    return slider;
  }
  confirm() {
    this.selectedTime = `${this.slideFirst.slides[this.slideFirst.realIndex].textContent} ${this.slideHour.slides[this.slideHour.realIndex].textContent}:${this.slideMin.slides[this.slideMin.realIndex].textContent}`;
    this.value = this.selectedTime;
    this.btn.textContent = this.value;
    this.btn.classList.add('isSelected');
    this.layer.hide();
    if(this.confirmCallBack) this.confirmCallBack(this);
  }
}

/**
 * 셀렉트, 캘린더 글로벌 세팅
 * @param {String} sort 셀렉트, 캘린더 공통 dataset 문자열
 */
let globalSelectObj = {}
let globalCalendarObj = {}
let globalTimeObj = {}
const globalObjSetFunc = (sort) => {
  const item = document.querySelectorAll(`[data-${sort}]`);
  item.forEach(_this=>{
    const _thisData = JSON.parse(_this.dataset[sort]);
    if(sort === 'select' && !globalSelectObj.hasOwnProperty(_thisData.name)) {
      globalSelectObj[_thisData.name] = new Select({target: _this, data: _thisData});
    } else if (sort === 'calendar' && !globalCalendarObj.hasOwnProperty(_thisData.name)) {
      globalCalendarObj[_thisData.name] = new Calendar({target: _this, data: _thisData});
    } else if(sort === 'time' && !globalTimeObj.hasOwnProperty(_thisData.name)) {
      globalTimeObj[_thisData.name] = new TimePicker({target: _this, data: _thisData});
    }
  });
  switch(sort) {
    case 'select' : {
      return globalSelectObj;
    }
    case 'calendar' : {
      return globalCalendarObj;
    }
    case 'time' : {
      return globalTimeObj;
    }
    default: {
      return false;
    }
  }
}

class TabContents {
  /**
   * 탭 컨텐츠
   * @param {Object} params {target: String or Element, type: slider}
   */
  constructor(params) {
    this.wrap = (typeof params.target !== 'string') ? params.target : document.querySelector(Util.returnRef(params.target));
    this.menu = this.wrap.querySelector('[role="tablist"]');
    this.btn = this.menu.querySelectorAll('[role="tab"]');
    this.current = null;
    this.currentBtn = null;
    this.currentCont = null;
    this.currentStr = 'isActive';
    this.chageCallBack = null;
    this.slider = (params.type === 'slider') ? true : false;
    this.init();
  }
  init() {
    for(let idx = 0; idx < this.btn.length ; idx++) {
      if(this.btn[idx].getAttribute('aria-selected') == 'true') {
        this.current = (this.btn[idx].getAttribute('aria-controls')) ? this.btn[idx].getAttribute('aria-controls') : this.btn[idx].innerText;
        this.currentBtn = this.btn[idx];
        this.currentBtn.parentNode.classList.add(this.currentStr)
        if(document.querySelector(`#${this.current}`)) {
          this.currentCont = document.querySelector(`#${this.current}`);
          this.currentCont.classList.add('isActive');
        }
        break;
      }
    }
    if(this.slider === true) {
      this.slider = slider({target: this.wrap, option: {
        wrapperClass: 'tab__list',
        slideClass: 'tab__item',
        slidesPerView: 'auto',
        freeMode: true
      }});
    }
    this.addEvent();
  }
  addEvent() {
    for(let idx = 0; idx < this.btn.length ; idx++) {
      this.btn[idx].addEventListener('click', ()=>{
        this.active(idx);
      });
    }
  }
  active(target) {
    this.currentBtn.ariaSelected = false;
    this.currentBtn.parentNode.classList.remove(this.currentStr);
    if(typeof target === 'number') {
      this.currentBtn = this.btn[target];
      if(this.slider) this.slider.slideTo(target);
    } else if(typeof target === 'string') {
      for(let idx = 0; idx < this.btn.length; idx++) {
        if(this.btn[idx].getAttribute('aria-controls') === target) this.currentBtn = this.btn[idx];
      }
    }
    this.currentBtn.ariaSelected = true;
    this.currentBtn.parentNode.classList.add(this.currentStr);
    if(this.currentBtn.getAttribute('aria-controls')) {
      this.current = this.currentBtn.getAttribute('aria-controls');
      this.currentCont.classList.remove('isActive');
      if(document.querySelector(`#${this.current}`)) {
        this.currentCont = document.querySelector(`#${this.current}`);
        this.currentCont.classList.add(this.currentStr);
      }
    } else {
      this.current = this.currentBtn.innerText;
    }
    if(this.chageCallBack) this.chageCallBack(this);
    return this;
  }
  onChange(callBack) {this.chageCallBack = callBack}
}

class ChartContents {
  /**
   * 차트
   * @param {Object} params {target: '챠트 영역', max: 최대숫자, unit: 단위, unitType: 단위표현}
   */
  constructor(params) {
    this.wrap = (typeof params.target !== 'string') ? params.target : document.querySelector(Util.returnRef(params.target));
    this.max = params.max;
    this.unit = params.unit;
    this.unitType = params.unitType;
    this.items = null;
    this.data = [];
    this.init();
    this.active();
  }
  init() {
    this.createBg();
    this.createData();
  }
  createBg() {
    const bg = document.createElement('div');
    bg.classList.add('bg');
    this.wrap.insertAdjacentElement('afterbegin', bg);
    for(let idx = 0; idx <= (this.max / this.unit); idx++) {
      bg.insertAdjacentHTML('afterbegin',
      `<div class="line"><span class="unit">${this.unit * idx}${this.unitType}</span></div>`
      );
    }
  }
  createData() {
    const items = this.wrap.querySelectorAll(Util.returnRef('item'))
    items.forEach(_this=>{
      let obj = {}
      obj["name"] = _this.querySelector(Util.returnRef('name')).innerText;
      obj["val"] = _this.querySelector(Util.returnRef('valNumber')).textContent;
      obj["target"] = _this.querySelector(Util.returnRef('target'));
      this.data.push(obj);
    });
  }
  active() {
    this.data.forEach(_this=>{
      if(_this.val <= 35){
        _this.target.style.height = '35%' // [PET-49,36] 23.07.11 수정
      }else{
        _this.target.style.height = (_this.val / this.max) * 100 + '%';
      }
    })
  }
}


/**
 *  스티키 버튼과 하단 네비게이션이 공존 할 경우 버튼의 위치.
 */
// const stickyBotnav = () => {
  

// setTimeout(()=>{
//   if(document.querySelector('.wrap')) {
//       document.querySelectorAll('.wrap > *').forEach((_this)=>{
//         if(_this.classList) {
//           if(_this.classList.contains('btn-wrap')){
//             document.querySelectorAll('.wrap > *').forEach(el => {
//               if(el.classList.contains('bot-nav')){
//                 _this.style.
//               }
//             });
//           }
//         }
//     });
//   }
// },50)

// }


/**
 * 말줄임 토글 기능
 * @param {Object} params {wrap: '전체 영역', line: '최대 노출 라인'}
 */
const ellipsisToggle = (params) => {
  const wrap = document.querySelector(Util.returnRef(params.wrap));
  const target = wrap.querySelector(Util.returnRef('toggleTarget'));
  const box = wrap.querySelector(Util.returnRef('toggleTargetBox'));
  const btn = wrap.querySelector(Util.returnRef('toggleBtn'));
  const limitHeight = getComputedStyle(target).getPropertyValue('line-height').split('px')[0] * params.line;
  if(limitHeight < box.clientHeight) {
    target.classList.add('isEllipsis');
    btn.classList.add('isShow');
  }
  btn.addEventListener('click',()=>{
    target.classList.toggle('isEllipsis');
    btn.classList.toggle('isActive');
  });
}

const funcLoading = (state) => {
  if(state === 'start') {
    const loadingEl = document.createElement('div');
    loadingEl.classList.add('loading-wrap');
    document.body.insertAdjacentElement('beforeend', loadingEl);
    document.body.classList.add('isLoading');
  } else if(state === 'end') {
    document.querySelector('.loading-wrap').remove();
    document.body.classList.remove('isLoading');
  }
}

// 모바일 100vh 대응
const funcVh = () => {
  document.documentElement.style.setProperty('--vh', `${window.innerHeight * 0.01}px`);
}
funcVh();

// safe-area 대응
window.addEventListener('scroll', ()=>{
  (getComputedStyle(document.documentElement).getPropertyValue('--sab').split('px')[0] > 0)
  ? document.body.classList.add('isSab')
  : document.body.classList.remove('isSab');
});

window.addEventListener('resize', ()=>{
  funcVh();
});

window.addEventListener('DOMContentLoaded', ()=>{
  funcVh();
  globalObjSetFunc('select');
  globalObjSetFunc('calendar');
  globalObjSetFunc('time');
});

if(Util.deviceChk() === 'isPC') document.documentElement.classList.add('isPC');


