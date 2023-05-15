let priviteEmail = function(){
	let USER_EMAIL = document.getElementById('getEmail');
	let SLICE_POINT = '@'
	let OUTPUT;
	
	USER_EMAIL.addEventListener('keyup',(e)=>{
	
		let USER_VALUE = USER_EMAIL.value // EMAIL VALUE DATA
	
		if(e.key == "Enter"){  // 엔터누르면 
			if(USER_VALUE.includes(SLICE_POINT)){
	
				let USER_ARRAY = USER_VALUE.split(SLICE_POINT); // SLICE POINT 기준으로 문자열 나누고 배열에 저장
				let USER_STRING = USER_ARRAY[0];
				let COMPANY = USER_ARRAY[1];
				let ARR01 = [];
				let ARR02 = [];
				let STR_INDEX = 0; // 1개의 배열의 length
				for(i = 0; i < 4; i++){
					STR_INDEX = (USER_STRING.length-1) - i;
					ARR01.push(USER_STRING[STR_INDEX]);
				}
	
				for(i = 0; i < USER_STRING.length-4; i++){
					ARR02.push(USER_STRING[i]);
				}
	
				console.log(ARR01, ARR02)
				
			}else{
				alert('email 형식이 아닙니다.')
			}
		}
		// alert(`회원님의 이메일 주소 ${result}로 메일을 발송했습니다.`);
	})
	
	// 문자열 **** 처리
	//num-mask
	function stringToStar(str){
		str = '*';
		return str;
	}
}
function mouseInOut(){
	var getdirection = function( ev, obj ){
		var w = $(obj).children('.main_num ul li .hov').width(),
		h = $(obj).children('.main_num ul li .hov').height(),
		x = (ev.pageX - $(obj).offset().left - (w / 2) * (w > h ? (h / w) : 1)),
		y = (ev.pageY - $(obj).offset().top - (h / 2) * (h > w ? (w / h) : 1)),
		dir = Math.round( Math.atan2(y, x) / 1.57079633 + 5 ) % 4;
		return dir;
	}
	
	var eff_addClass = function( ev, obj, state ){
		var direction = getdirection( ev, obj ),
			class_dir = "";
		$(obj).removeClass('in-top in-left in-right in-bottom out-top out-right out-bottom out-left');
		switch(direction){
			/*Top*/
			case 0: class_dir = '-top'; break;
			/*Right*/
			case 1: class_dir = '-right'; break;
			/*Bottom*/
			case 2: class_dir = '-bottom'; break;
			/*Left*/
			case 3: class_dir = '-left'; break;
		}
		$(obj).addClass( state + class_dir );
	}
	
	$('.main_num ul li a').each(function(){
		var $this = $(this);
		setTimeout(function  () {
			$this.on('mouseenter',function( ev ){
				$(this).removeClass('out');
				eff_addClass( ev, this, 'in');
			})
			.on(' mouseleave',function( ev ){
				 $(this).addClass('out');
			});
		},50)
	});
}
class Compare {
	constructor(callBack){
		this.drag = document.getElementById("drag")
		this.wrap = document.querySelector(".dragObjWrap")
		this.container = document.querySelector(".container")
		this.dragItems = this.wrap.querySelectorAll(".dragObj")
		this.dragItemsTarget = this.wrap.querySelectorAll('.dragObj .top')
		this.scrollItemTarget = this.wrap.querySelectorAll('.dragObj .cont')
		this.touchItems = this.wrap.querySelectorAll('.dropObj')
		this.fixedItem = this.wrap.querySelector('.fixed')
		this.pin = this.wrap.querySelectorAll('.dragObj .pin')
		
		this.targetPadding = Number(
			window
			.getComputedStyle(this.container)
			.getPropertyValue("padding")
			.replace("px", "")
		);

		this.eventState = {
			clickCompare : false, // mousedown : true / mouseup : false
			moveCompare : false, // move on: true / move out : false
			touchCompare : false, // touch on: true / touch out : false
			navCompare : false, // create nav view :true / none : false
			scrollCompare : false,
		}

		// default
		this.currentItem = null
		this.currentclone = null
		this.droppableBelow = null
		this.futureItem = null
		this.shiftX = null
		this.saveScroll = 0
		this.scrollX = window.scrollX;

		// this.longTouch = 0
		this.result = 0
		this.touchNav = null

		// DviceCheck
		this.TYPE_DEVICE = /iPad|tablet/i.test(window.navigator.userAgent)

		this.load()
		this.callBack(callBack)
	}

	load(){
		window.onload = () => {
			let scrollArea = this.dragItems[0].clientWidth * this.dragItems.length;
			this.wrap.style.width = scrollArea + 'px';
		}
		
		// fixed view
		this.container.addEventListener('scroll',(e) => {
			this.scrollFixed(e.target,this.fixedItem);
		})

		if(!this.TYPE_DEVICE){
			/*	*	*	*	*
			*	DEVICE TYPE	*
			*	> DESKTOP <	*
			*	*	*	*	*/
			// console.log("device type : DeskTop")

			//scroll Event Listener
			this.scrollItemTarget.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollSticky(e);
				})
			});

			// mouse Down Event Listener
			this.dragItemsTarget.forEach(element => {
				element.addEventListener("mousedown", (e) => {
					if(!e.target.closest(".dragObj").classList.contains('fixed')){
						this.eventState.clickCompare = true;
						if(this.eventState.clickCompare) this.dragMouseDown(e);
					}
				})
			})

			// Mouse Move Event
			this.drag.addEventListener("mousemove", (e) => {
				this.eventState.moveCompare = true;
				if(this.eventState.clickCompare && this.eventState.moveCompare) this.dragMouseMove(e);
			})

			// PIN CLICK EVENT
			this.pin.forEach(element => {
				element.addEventListener("mousedown", (e) => {
					this.PINSwitch(e)
				})
			})
			
			// Mouse Up Event Listner
			window.addEventListener("mouseup", (e) => {
				if(e.target.closest('.dragObjWrap')){
					if(!e.target.closest(".dragObj").classList.contains('fixed')){
						if(this.eventState.clickCompare) this.dragMouseUp(e);
					}
				}
			})


		}else if(this.TYPE_DEVICE){
			
			/*	*	*	*	*
			*	DEVICE TYPE	*
			*	> TABLET <	*
			*	*	*	*	*/
			// console.log("device type : tablet")
		
			//scroll Event Listener
			this.scrollItemTarget.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollLoad(e);
					if(this.eventState.touchCompare) this.eventState.touchCompare = false;
				})
			})

			this.container.addEventListener("scroll", (e) => {
				this.scrollLoad(e);
				if(this.eventState.touchCompare) this.eventState.touchCompare = false;
			})
			// mouse Down Event Listener
			this.dragItemsTarget.forEach(element => {
				element.addEventListener("touchstart" , (e) => {
					this.touchStart(e);
				})
			});

			// PIN CLICK EVENT
			this.pin.forEach(element => {
				element.addEventListener("touchstart", (e) => {
					this.PINSwitch(e)
				})
			});

			window.addEventListener("touchend", (e) => {
				this.touchEnd(e);
			})
		}
	}
	scrollLoad(e){
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(e.target.classList.contains('cont')){
			this.scrollSticky(e)
		}
	}

	scrollSticky(e){
		this.saveScroll = e.target.scrollTop;
		
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(this.eventState.scrollCompare && !this.eventState.touchCompare){
			for (let i = 0; i < this.scrollItemTarget.length; i++) {
				this.scrollItemTarget[i].scrollTop = e.target.scrollTop;
			}
			if(e.target.scrollTop >= 1){
				this.wrap.classList.add('sticky');
			}else if(e.target.scrollTop == 0){
				this.wrap.classList.remove('sticky');
			}
		}
	}

	dragMouseDown(e){
		this.currentItem = e.target.closest(".dragObj");

		e.target.ondragstart = () => {return false};

		this.dragSetting(e);
	}

	dragMouseMove(e){
		this.currentItem.hidden = true;
		this.element = document.elementFromPoint(e.pageX - this.scrollX, e.pageY - window.pageYOffset);
		this.currentItem.hidden = false;

		this.droppableBelow = this.element.closest('.dragObj');

		if(this.droppableBelow && !this.droppableBelow.classList.contains('fixed')){

			if (this.futureItem != this.droppableBelow) {
				if (this.futureItem) leaveDroppable(this.futureItem);
				
				this.futureItem = this.droppableBelow;
				if (this.droppableBelow) enterDroppable(this.futureItem);
			}
	
			function enterDroppable(elem) {
				elem.style.border = "4px solid #00AAD2";
			}

			function leaveDroppable(elem) {
				elem.style.border = "";
			}
	
			this.MoveAt(e.pageX);
		}else{
			this.init();
		}

	
	}

	dragMouseUp(e){
		if (this.futureItem !== null) {
			this.futureItem.style.border = "";

			this.currentIdx = this.currentItem.dataset.dragIndex;
			this.futureIdx = this.futureItem.dataset.dragIndex;

			if (this.currentIdx !== this.futureIdx) {
				this.changeElement(this.currentItem, this.futureItem);
			}
		}
		e.mouseUp = null;
		this.init(e);
	}

	MoveAt(pageX){
		this.currentItem.style.left = pageX - this.shiftX - this.scrollX + "px";
	}

	dragSetting(e){
		// Create Clone
		this.currentclone = this.currentItem.cloneNode(true);
		this.currentclone.classList.add("clone");
		this.currentItem.before(this.currentclone);
		

		this.currentclone.querySelector('.cont').scrollTop = this.saveScroll

		// // pointer x,y 계산
		this.shiftX = e.pageX - this.currentItem.getBoundingClientRect().left - this.container.scrollLeft + this.targetPadding + this.container.getBoundingClientRect().left;
		// target style
		this.currentItem.style.position = "absolute";
		this.currentItem.style.top = "0";
		this.currentItem.style.zIndex = "9999";
		this.currentItem.style.opacity = "0.5";
	}

	// pin click
	PINSwitch(e){
		const fixItem = document.querySelector('.fixed');
		if(e.target.dataset.fix == 'false' || e.target.dataset.fix == ""){
			const currentItem = e.target.closest('.dragObj');
			
			e.target.dataset.fix = true;
			fixItem.querySelector('.pin').dataset.fix = false;

			currentItem.classList.add('fixed');
			fixItem.classList.remove('fixed');

			this.changeElement(currentItem, fixItem)
		}
		this.init(e)
	}

	// Tablet
	touchStart(e){
		this.init();
		this.eventState.scrollCompare = false;
		this.eventState.touchCompare = true;
	}

	touchEnd(e){
		if(this.eventState.touchCompare && !this.eventState.scrollCompare){
			this.eventState.navCompare = true;
			this.targetSelect(e);
		}else{
			this.init(e);
		}
	}
	
	targetSelect(e){
		let item = e.target.closest('.dropObj');
		if(this.eventState.navCompare && !item.querySelector('.dragObj').classList.contains('fixed')){
			item.classList.add('select');
			this.createNavi(e, item);
		}
	}

	touchMove(e){
		function itemChild(target){
			if(target == null){
				return null
			}else{
				let output = target.querySelector('.dragObj');
				return output
			}
		}

		let _this = e.target.closest('.dropObj');
		let _thisNext = _this.nextSibling.nextSibling;
		let _thisPrev = _this.previousSibling.previousSibling;
		let item = itemChild(_this);
		let nextItem = itemChild(_thisNext);
		let prevItem = itemChild(_thisPrev);

		let button = e.target;


		if(button.classList.contains('touch_prev') && _thisPrev !== null && !prevItem.classList.contains('fixed')){
			this.changeElement(item, prevItem)
		}else if(button.classList.contains('touch_next') && _thisNext !== null){
			this.changeElement(item, nextItem)
		}

		this.init();
	}
	
	createNavi(e, item){
		if(this.eventState.navCompare && e.target.closest('.dragObj')){
			this.touchNav = document.createElement('div');
			this.touchNav.classList.add('touchNav');
			
			let touchNavPrev = document.createElement('button');
			let touchNavNext = document.createElement('button');
			touchNavPrev.classList.add('touch_prev');
			touchNavNext.classList.add('touch_next');
	
			touchNavPrev.innerText = "prev"
			touchNavNext.innerText = "next"
			
			this.touchNav.append(touchNavPrev, touchNavNext)
			e.target.closest('.dropObj').append(this.touchNav);
		}

		// if(this.eventState.navCompare){
			let touchButton = this.touchNav.querySelectorAll('[class^=touch_]');

			touchButton.forEach(element => {
				element.addEventListener('touchstart', (e) => {this.touchMove(e)});
			});
		// }
	}

	changeElement(targetItem, changeItem) {
		let cgSaveBox = changeItem.closest('.dropObj');
		let tgSaveBox = targetItem.closest('.dropObj');

		cgSaveBox.append(targetItem);
		tgSaveBox.append(changeItem);

		targetItem.querySelector('.cont').scrollTop = this.saveScroll;
		changeItem.querySelector('.cont').scrollTop = this.saveScroll;
	}

	scrollFixed(wrap,target){
		target.style.left = wrap.scrollLeft + 'px';
	}

	init(e){
		// cloneScroll = itemScroll;
		this.fixedItem = this.wrap.querySelector('.fixed');
		if(this.eventState.clickCompare){
			for (let i = 0; i < this.dragItemsTarget.length; i++) {
				this.dragItemsTarget[i].closest('.dragObj').setAttribute("style","");
			}

			this.currentclone.remove();

			// default
			this.currentItem = null
			this.currentclone = null
			this.droppableBelow = null
			this.futureItem = null
			this.shiftX = null

			this.eventState.clickCompare = false;
			this.eventState.moveCompare = false;
			
			this.dragItemsTarget.forEach(element => {
				element.removeEventListener("mousedown", this.dragMouseDown)
			});
			
			window.removeEventListener("mouseup", this.dragMouseUp)
			this.wrap.removeEventListener("mousemove", this.dragMouseMove)
			this.scrollFixed(this.container,this.fixedItem);
		}

		if(this.eventState.touchCompare){
			this.result = 0;
			// this.longTouch = 0;
			this.eventState.touchCompare = false;
			this.eventState.navCompare = false;
			this.eventState.scrollCompare = false;
			this.touchNav.remove();
			this.dragItemsTarget.forEach(element => {
				element.removeEventListener('touchstart', this.touchStart)
			})
			window.removeEventListener('touchend', this.touchEnd);

			for(let i = 0; i < this.touchItems.length; i++){
				this.touchItems[i].classList.remove('select');
			}
			this.scrollFixed(this.container,this.fixedItem);
		}
		
		this.scrollFixed(this.container,this.fixedItem);
		window.removeEventListener("scroll", this.scrollSticky);
	}

	get _return(){
		let obj = {
			target : this.dragItems,
			index :  this.dragItems.length,
			pin : this.pin,
			fixObjIndex : this.dragItems,
			fixObj : this.fixedItem,
			deviceType : this.TYPE_DEVICE ? 'iPad & tablet' : 'Desktop'
		}
		return obj
	}

	callBack(callBack){
		if(callBack){
			callBack();
		}
	}

}

/**
 * * @param {Function} callBack
 * * @param {Object} objReturn
* 	objReturn = {
		target : this.dragItems,
		index :  this.dragItems.length,
		pin : this.pin,
		fixObjIndex : this.dragItems,
		fixObj : this.fixedItem,
		deviceType : this.TYPE_DEVICE
	}
 */
class carCompare {
	constructor(callBack){
		this.drag = document.getElementById("drag")
		this.wrap = document.querySelector(".dragObjWrap")
		this.parent = document.querySelector(".dragParent")
		this.dragItems = this.wrap.querySelectorAll(".dragObj")
		this.dragItemsCont = this.wrap.querySelectorAll('.dragObj .cont')
		this.touchItems = this.wrap.querySelectorAll('.dropObj')
		this.fixedItem = this.wrap.querySelector('.fixed')
		this.pin = this.wrap.querySelectorAll('.dragObj .pin')
		
		this.targetPadding = Number(
			window
			.getComputedStyle(this.parent)
			.getPropertyValue("padding")
			.replace("px", "")
		);

		this.eventState = {
			clickCompare : false, // mousedown : true / mouseup : false
			moveCompare : false, // move on: true / move out : false
			touchCompare : false, // touch on: true / touch out : false
			navCompare : false, // create nav view :true / none : false
			scrollCompare : false,
		}

		// default
		this.currentItem = null
		this.currentclone = null
		this.droppableBelow = null
		this.futureItem = null
		this.shiftX = null
		this.scrollX = window.scrollX;

		this.longTouch = 0
		this.result = 0
		this.touchNav = null

		// DviceCheck
		this.TYPE_DEVICE = /iPad|tablet/i.test(window.navigator.userAgent)


		// this.callBack = callBack;
		this.load()
		this.callBack(callBack)
	}

	
	load(){
		window.onload = () => {
			let scrollArea = this.dragItems[0].clientWidth * this.dragItems.length;
			this.wrap.style.width = scrollArea + 'px';
		}



		if(!this.TYPE_DEVICE){
			
		/*	*	*	*	*
		*	DEVICE TYPE	*
		*	> DESKTOP <	*
		*	*	*	*	*/

			//scroll Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollSticky(e)
				})
			});

			// mouse Down Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("mousedown", (e) => {
					if(!e.target.closest(".dragObj").classList.contains('fixed')){
						this.eventState.clickCompare = true;
						if(this.eventState.clickCompare) this.dragMouseDown(e);
					}
				})
			})

			// Mouse Move Event
			this.drag.addEventListener("mousemove", (e) => {
				this.eventState.moveCompare = true;
				if(this.eventState.clickCompare && this.eventState.moveCompare) this.dragMouseMove(e);
			})

			// PIN CLICK EVENT
			this.pin.forEach(element => {
				element.addEventListener("mousedown", (e) => {
					this.PINSwitch(e)
				})
			})
			
			// Mouse Up Event Listner
			window.addEventListener("mouseup", (e) => {
				if(e.target.closest('.dragObjWrap')){
					if(!e.target.closest(".dragObj").classList.contains('fixed')){
						if(this.eventState.clickCompare) this.dragMouseUp(e);
					}
				}
			})


		}else if(this.TYPE_DEVICE){

		/*	*	*	*	*
		*	DEVICE TYPE	*
		*	> TABLET <	*
		*	*	*	*	*/
		
			//scroll Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("scroll", (e) => {
					this.scrollLoad(e);
					if(this.eventState.touchCompare) this.eventState.touchCompare = false;
				})
			})

			this.parent.addEventListener("scroll", (e) => {
				this.scrollLoad(e);
				if(this.eventState.touchCompare) this.eventState.touchCompare = false;
			})
			// mouse Down Event Listener
			this.dragItemsCont.forEach(element => {
				element.addEventListener("touchstart" , (e) => {
					this.touchStart(e);
				})
			});

			// PIN CLICK EVENT
			this.pin.forEach(element => {
				element.addEventListener("touchstart", (e) => {
					this.PINSwitch(e)
				})
			});

			window.addEventListener("touchend", (e) => {
				this.touchEnd(e);
			})
		}
	}
	scrollLoad(e){
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(e.target.classList.contains('cont')){
			this.scrollSticky(e)
		}
	}

	scrollSticky(e){
		this.eventState.scrollCompare = true;
		this.eventState.touchCompare = false;

		if(this.eventState.scrollCompare && !this.eventState.touchCompare){
			for (let i = 0; i < this.dragItemsCont.length; i++) {
				this.dragItemsCont[i].scrollTop = e.target.scrollTop;
			}
			if(e.target.scrollTop >= 1){
				this.wrap.classList.add('sticky');
			}else if(e.target.scrollTop == 0){
				this.wrap.classList.remove('sticky');
			}
		}
	}

	dragMouseDown(e){
		this.currentItem = e.target.closest(".dragObj");

		e.target.ondragstart = () => {return false};

		this.dragSetting(e);
	}

	dragMouseMove(e){
		this.currentItem.hidden = true;
		this.element = document.elementFromPoint(e.pageX - this.scrollX, e.pageY - window.pageYOffset);
		this.currentItem.hidden = false;

		this.droppableBelow = this.element.closest('.dragObj');

		if(this.droppableBelow && !this.droppableBelow.classList.contains('fixed')){

			if (this.futureItem != this.droppableBelow) {
				if (this.futureItem) leaveDroppable(this.futureItem);
				
				this.futureItem = this.droppableBelow;
				if (this.droppableBelow) enterDroppable(this.futureItem);
			}
	
			function enterDroppable(elem) {
				elem.style.border = "4px solid #00AAD2";
			}

			function leaveDroppable(elem) {
				elem.style.border = "";
			}
	
			this.MoveAt(e.pageX);
		}else{
			this.init();
		}

	
	}

	dragMouseUp(e){
		if (this.futureItem !== null) {
			this.futureItem.style.border = "";

			this.currentIdx = this.currentItem.dataset.dragIndex;
			this.futureIdx = this.futureItem.dataset.dragIndex;

			if (this.currentIdx !== this.futureIdx) {
				this.changeElement(this.currentItem, this.futureItem);
			}
		}
		e.mouseUp = null;
		this.init(e);
	}


	MoveAt(pageX){
		this.currentItem.style.left = pageX - this.shiftX - this.scrollX + "px";
	}

	

	dragSetting(e){
		// Create Clone
		this.currentclone = this.currentItem.cloneNode(true);
		this.currentclone.classList.add("clone");
		this.currentItem.before(this.currentclone);
		
		// // pointer x,y 계산
		this.shiftX = e.pageX - this.currentItem.getBoundingClientRect().left - this.parent.scrollLeft + this.targetPadding;

		// target style
		this.currentItem.style.position = "absolute";
		this.currentItem.style.top = "0";
		this.currentItem.style.zIndex = "9999";
		this.currentItem.style.opacity = "0.5";
	}

	// pin click
	PINSwitch(e){
		if(e.target.dataset.fix == 'false' || e.target.dataset.fix == ""){
			const currentItem = e.target.closest('.dragObj');
			const fixItem = document.querySelector('.fixed');
			
			e.target.dataset.fix = true;
			fixItem.querySelector('.pin').dataset.fix = false;

			currentItem.classList.add('fixed');
			fixItem.classList.remove('fixed');

			this.changeElement(currentItem, fixItem)
		}
	}

	// Tablet
	touchStart(e){
		this.init();
		this.eventState.scrollCompare = false;
		this.eventState.touchCompare = true;
	}

	touchEnd(e){
		if(this.eventState.touchCompare && !this.eventState.scrollCompare){
			this.eventState.navCompare = true;
			this.targetSelect(e);
		}else{
			this.init(e);
		}
	}
	
	targetSelect(e){
		let item = e.target.closest('.dropObj');
		if(this.eventState.navCompare && !item.querySelector('.dragObj').classList.contains('fixed')){
			item.classList.add('select');
			this.createNavi(e, item);
		}
	}

	touchMove(e){
		function itemChild(target){
			if(target == null){
				return null
			}else{
				let output = target.querySelector('.dragObj');
				return output
			}
		}

		let _this = e.target.closest('.dropObj');
		let _thisNext = _this.nextSibling.nextSibling;
		let _thisPrev = _this.previousSibling.previousSibling;
		let item = itemChild(_this);
		let nextItem = itemChild(_thisNext);
		let prevItem = itemChild(_thisPrev);

		let button = e.target;


		if(button.classList.contains('touch_prev') && _thisPrev !== null && !prevItem.classList.contains('fixed')){
			this.changeElement(item, prevItem)
		}else if(button.classList.contains('touch_next') && _thisNext !== null){
			this.changeElement(item, nextItem)
		}

		this.init();
	}
	
	createNavi(e, item){
		if(this.eventState.navCompare && e.target.closest('.dragObj')){
			this.touchNav = document.createElement('div');
			this.touchNav.classList.add('touchNav');
			
			let touchNavPrev = document.createElement('button');
			let touchNavNext = document.createElement('button');
			touchNavPrev.classList.add('touch_prev');
			touchNavNext.classList.add('touch_next');
	
			touchNavPrev.innerText = "prev"
			touchNavNext.innerText = "next"
			
			this.touchNav.append(touchNavPrev, touchNavNext)
			e.target.closest('.dropObj').append(this.touchNav);
		}

		// if(this.eventState.navCompare){
			let touchButton = this.touchNav.querySelectorAll('[class^=touch_]');
			touchButton.forEach(element => {
				element.addEventListener('touchstart', (e) => {this.touchMove(e)});
			});
		// }
	}

	changeElement(targetItem, changeItem) {
		
		let cgSaveBox = changeItem.closest('.dropObj');
		let tgSaveBox = targetItem.closest('.dropObj');

		cgSaveBox.append(targetItem);
		tgSaveBox.append(changeItem);
	}

	init(e){
		// let scrollSave = e.target.closest('.dragObj').querySelector('.cont')
		// console.log(scrollSave.scrollTop)
		// e.target.closest('.dragObj')
		// let cloneScroll = this.currentclone.querySelector('.cont').scrollTop;
		// let itemScroll = this.currentclone.querySelector('.cont').scrollTop;
		// cloneScroll = itemScroll;
		for (let i = 0; i < this.dragItemsCont.length; i++) {
			this.dragItemsCont[i].closest('.dragObj').setAttribute("style","");
		}
		if(this.eventState.clickCompare){

			this.currentclone.remove();
			// default
			this.currentItem = null
			this.currentclone = null
			this.droppableBelow = null
			this.futureItem = null
			this.shiftX = null

			this.eventState.clickCompare = false;
			this.eventState.moveCompare = false;
			
			this.dragItemsCont.forEach(element => {
				element.removeEventListener("mousedown", this.dragMouseDown)
			});
			
			window.removeEventListener("mouseup", this.dragMouseUp)
			this.wrap.removeEventListener("mousemove", this.dragMouseMove)
		}

		if(this.eventState.touchCompare){
			this.result = 0;
			this.longTouch = 0;
			this.eventState.touchCompare = false;
			this.eventState.navCompare = false;
			this.eventState.scrollCompare = false;
			this.touchNav.remove();
			this.dragItemsCont.forEach(element => {
				element.removeEventListener('touchstart', this.touchStart)
			})
			window.removeEventListener('touchend', this.touchEnd);

			for(let i = 0; i < this.touchItems.length; i++){
				this.touchItems[i].classList.remove('select');
			}

		}
		window.removeEventListener("scroll", this.scrollSticky);
	}

	get _return(){
		let obj = {
			target : this.dragItems,
			index :  this.dragItems.length,
			pin : this.pin,
			fixObjIndex : this.dragItems,
			fixObj : this.fixedItem,
			deviceType : this.TYPE_DEVICE ? 'iPad & tablet' : 'Desktop'
		}
		return obj
	}

	callBack(callBack){
		if(callBack){
			callBack();
		}
	}

}

function selectStep(callback){
	window.onbeforeunload = () => window.scrollTo(0, 0)
	
	// Element
	const wrap= document.getElementById('stepSelect');
	const itemSibling= wrap.querySelectorAll(".question_item");
	const nextButton= wrap.querySelectorAll(".nextButton");
	const radioElement= wrap.querySelectorAll('input[type="radio"]');
	const inputElement= wrap.querySelectorAll('[class^="inp_type"] input');
	const textareaElement = wrap.querySelectorAll('textarea');

	const scrollWrap = wrap.querySelector('.question');

	let viewArea = null;
	let _this = null;
	let _target = null;
	let _sibling = null;
	let _button = null;
	let idx = 0;
	let scrolly = 0;
	let x = 0;
	let SwichObj = {
		enter : false, 
	};

	wrap.addEventListener('wheel', preventScroll, {passive: false});

	function radioIdCheck(keyWord, _this){ return _this.getAttribute("id").search(keyWord)}
	

	radioElement.forEach(el => {el.addEventListener('click', clickOrTouch);})
	nextButton.forEach(el => {el.addEventListener('click', nextBtnClick);})
	inputElement.forEach(el => {el.addEventListener('keydown', keydown);})
	textareaElement.forEach(el => {el.addEventListener('keydown', keydown);})
	
	function  preventScroll(e){
		e.preventDefault();
		e.stopPropagation(); 
		return false;
	}

	function clickOrTouch(e){
		viewArea = e.target.closest('.question_item').querySelector('.viewForm');
		if(radioIdCheck('yes', e.target) == 0){
			evtHeight = e.target.closest('.question_item').scrollHeight;
			viewArea.setAttribute('data-view', 'true');
		}else if(radioIdCheck('no', e.target) == 0){
			viewArea.setAttribute('data-view', 'false');
			evtHeight = e.target.closest('.question_item').scrollHeight;
			if(viewArea.getAttribute('data-view') == 'false'){nextStep(e, evtHeight);}
		}
	}

	function nextBtnClick(e){
		evtHeight = e.target.closest('.question_item').scrollHeight
		if(e.type == 'click' && e.target.getAttribute('type') == 'button'){
			nextStep(e, evtHeight);
		}
	}

	function keydown(e){
		evtHeight = e.target.closest('.question_item').scrollHeight
		_this = e.target;
		_button = e.target.closest('.question_item').querySelector('button');

		if(e.keyCode !== 13){
			SwichObj.enter = true;
			if(_this.getAttribute('data-num')){
				_this.value = numberWithCommas(chkNumber(_this.value))
			}
		}
		
		if( _this.value.length > 0){
			_button.removeAttribute('disabled');
			if(e.keyCode === 13 && SwichObj.enter){
				if(_this.getAttribute('data-num')){
					_this.value = numberWithCommas(chkNumber(_this.value))
					nextStep(e, evtHeight);
				}else {
					nextStep(e, evtHeight);
				}
			}
		}else if( _this.value.length == 0){
			_button.setAttribute('disabled', "");
		}
	}
	function nextStep (e, evtHeight){
		++idx;
		if(idx < itemSibling.length){
			_this = e.target;
			_button = _this.closest('.question_item').querySelector('button');
			_button.setAttribute('disabled', "");
			_this.setAttribute('disabled', "");
			_target = _this.closest('.question_item');
			_sibling = itemSibling[idx];
	
			_target.classList.remove('active');
			_sibling.classList.add('active');
			focus(e, evtHeight);
		}else if(idx == itemSibling.length){
			init(callback);
		}

		SwichObj.enter = false;
	}

	function focus(e, evtHeight){
		scrolly = evtHeight + 180;
		x -= scrolly
		scrollWrap.style.top = x + 'px'
	}

	function init (callBack){
		if(callBack){
			callBack(this);
		}
		viewArea = null;
		_this = null;
		_target = null;
		_sibling = null;
		_button = null;
		idx = 0;

		return false
	}
}


const selectStep2 = (callback) => {
	window.onbeforeunload = () => window.scrollTo(0, 0)
	
	// Element
	const wrap= document.getElementById('stepSelect');
	const itemSibling= wrap.querySelectorAll(".question_item");
	const nextButton= wrap.querySelectorAll(".nextButton");
	const radioElement= wrap.querySelectorAll('input[type="radio"]');
	const inputElement= wrap.querySelectorAll('[class^="inp_type"] input');
	const textareaElement = wrap.querySelectorAll('textarea');

	const scrollWrap = wrap.querySelector('.question');

	let viewArea = null;
	let _this = null;
	let _target = null;
	let _sibling = null;
	let _button = null;
	let idx = 0;
	let scrolly = 0;
	let x = 0;
	let SwichObj = {
		enter : false, 
	};

	wrap.addEventListener('wheel', preventScroll, {passive: false});

	function radioIdCheck(keyWord, _this){ return _this.getAttribute("id").search(keyWord)}
	

	radioElement.forEach(el => {el.addEventListener('click', clickOrTouch);})
	nextButton.forEach(el => {el.addEventListener('click', nextBtnClick);})
	inputElement.forEach(el => {el.addEventListener('keydown', keydown);})
	textareaElement.forEach(el => {el.addEventListener('keydown', keydown);})
	
	function  preventScroll(e){
		e.preventDefault();
		e.stopPropagation(); 
		return false;
	}

	function clickOrTouch(e){
		viewArea = e.target.closest('.question_item').querySelector('.viewForm');
		if(radioIdCheck('yes', e.target) == 0){
			evtHeight = e.target.closest('.question_item').scrollHeight;
			viewArea.setAttribute('data-view', 'true');
		}else if(radioIdCheck('no', e.target) == 0){
			viewArea.setAttribute('data-view', 'false');
			evtHeight = e.target.closest('.question_item').scrollHeight;
			if(viewArea.getAttribute('data-view') == 'false'){nextStep(e, evtHeight);}
		}
	}

	function nextBtnClick(e){
		evtHeight = e.target.closest('.question_item').scrollHeight
		if(e.type == 'click' && e.target.getAttribute('type') == 'button'){
			nextStep(e, evtHeight);
		}
	}

	function keydown(e){
		evtHeight = e.target.closest('.question_item').scrollHeight
		_this = e.target;
		_button = e.target.closest('.question_item').querySelector('button');

		if(e.keyCode !== 13){
			SwichObj.enter = true;
			if(_this.getAttribute('data-num')){
				_this.value = numberWithCommas(chkNumber(_this.value))
			}
		}
		
		if( _this.value.length > 0){
			_button.removeAttribute('disabled');
			if(e.keyCode === 13 && SwichObj.enter){
				if(_this.getAttribute('data-num')){
					_this.value = numberWithCommas(chkNumber(_this.value))
					nextStep(e, evtHeight);
				}else {
					nextStep(e, evtHeight);
				}
			}
		}else if( _this.value.length == 0){
			_button.setAttribute('disabled', "");
		}
	}
	function nextStep (e, evtHeight){
		++idx;
		if(idx < itemSibling.length){
			_this = e.target;
			_button = _this.closest('.question_item').querySelector('button');
			_button.setAttribute('disabled', "");
			_this.setAttribute('disabled', "");
			_target = _this.closest('.question_item');
			_sibling = itemSibling[idx];
	
			_target.classList.remove('active');
			_sibling.classList.add('active');
			focus(e, evtHeight);
		}else if(idx == itemSibling.length){
			console.log("end")
			init(callback);
		}

		SwichObj.enter = false;
	}

	function focus(e, evtHeight){
		scrolly = evtHeight + 180;
		x -= scrolly
		scrollWrap.style.top = x + 'px'
	}

	function init (callBack){
		if(callBack){
			callBack(this);
		}
		viewArea = null;
		_this = null;
		_target = null;
		_sibling = null;
		_button = null;
		idx = 0;

		return false
	}
}


class test{
	constructor(option){
		window.onbeforeunload = () => window.scrollTo(0, 0)
		this.option = option;
		this.viewArea = null
		this._this = null
		this._target = null
		this._sibling = null
		this._button = null
		this.idIndex = 0
		this.scrolly = 0
		this.x = 0
		this.enter = false
		this.setting()
	}

	setting(){
		if(this.option.callBack){
			this.option.callBack();
		}
		// start();
	}
}
// // promise ajax 
// var ajaxHole = document.querySelector('.ajax--hole');
// function getData(callbackFunc) {
// 	$.get('https://tcpostatic.hmc.co.kr/contents/vehicle/sideview/mdlgrp_111.png', function(response) {
// 	  callbackFunc(response); // 서버에서 받은 데이터 response를 callbackFunc() 함수에 넘겨줌
// 	});
//   }
  
//   getData(function(tableData) {
// 	console.log(tableData)// $.get()의 response 값이 tableData에 전달됨
//   });

new Promise(function(resolve, reject){
	setTimeout(function() {
	  resolve(1);
	}, 2000);
  })
  .then(function(result) {
	console.log(result); // 1
	return result + 10;
  })
  .then(function(result) {
	console.log(result); // 11
	return result + 20;
  })
  .then(function(result) {
	console.log(result); // 31
  });



  let cpo_main = {
	fn : function (){
		// 화면에 보일 때 인터렉션
		const observer = new IntersectionObserver((entries) => {
			entries.forEach(entries => {
				if(entries.isIntersecting){
					entries.target.classList.add('active');

					// active lottie
					if(entries.target.classList.contains('hi_section')){
						lottieStart();
					}
				}
			});
		});

		const sectionItem = document.querySelectorAll('.script--no--parallax section');  // paralleax 인터렉션 아닌 섹션
		const parallaxItem = document.querySelectorAll('.script--parallax section'); // paralleax 인터렉션인 섹션
		const bannerItem = document.querySelectorAll('.banner_wrap'); // 중간 배너

		function oserveSetting(element){
			let options = {
				rootMargin: '0px',
				threshold: 0.5
			}
			observer.observe(element,options); 
		}
		bannerItem.forEach(element => { // banner observe interaction
			oserveSetting(element)
		});

		parallaxItem.forEach(element => { // paralleax observe interaction
			oserveSetting(element)
		});

		sectionItem.forEach(element => { // NO paralleax observe interaction
			oserveSetting(element)
		});


		// hi-lab 섹션 로티 이미지
		let lottieState = true; // lottie start state (한 번만 실행시키기 위한 플래그)

		const lottieStart = () => {
			if(lottieState){
				let hiSection = document.querySelector('.hi_section');
				let lottieArea = hiSection.querySelector('.hi_section .lottie_area');
				const lottieAni = [
					{
						wrapper: lottieArea,
						animType: 'svg',
						loop: true,
						autoplay: true,
						path: lottiePath,
					}
				]
				bodymovin.loadAnimation(lottieAni[0]);
			}
			lottieState = false;
		}

		// text 노출 flag 
		let createTextState = true; 

		// main visual swiper
		const mainSwiper =  new Swiper('.main_swiper', getSwiperOption({
				target : '.main_swiper',
				slidesPerView : 1,
				pagination : true,
				pagination_cls : '01',
				navigation : true,
				navigation_cls: 'type03',   
				controler: {
					wrap : 'pagination',
				},
				loop: true,
				addOption : {
					autoplay : true,
					loopAdditionalSlides : 1,
					effect : 'fade',
					on: {
						slideChangeTransitionStart: function(){ // 트랜지션 start point 
							if(createTextState){
								prevTextCreate(); 
							}
							textIndexEnd(this);
							textIndexStart(this);
						},
						init : function(){
							swiperControler();
						},
					},
				},
			})
		)

		// const isMainBtn = document.querySelectorAll('.main_swiper [class^="swiper-button"]');
		// const isMainNext = document.querySelector('.main_swiper .swiper-button-next');
		// const isMainPrev = document.querySelector('.main_swiper .swiper-button-prev');


		// 메인 비쥬얼 스와이퍼 화살표 옆 텍스트 생성
		// 스와이퍼 안에 html로 들어간 자동차 이름값을 가져와서 txt로 추가.
		function prevTextCreate(isSwiper){
			let mainSwiper = document.querySelector('.main_swiper')
			let carName = document.querySelectorAll('.swiper-slide .car_name');
			let prevTextWrap = document.createElement('div');
			let nextTextWrap = document.createElement('div');
			
			prevTextWrap.classList.add('prev_txt');
			nextTextWrap.classList.add('next_txt');

			carName.forEach(el => {
				let textSpan = document.createElement('span');
				let textCloneSpan = textSpan.cloneNode(true);
				textSpan.innerHTML = el.innerText; 
				textCloneSpan.innerHTML = el.innerText;

				nextTextWrap.append(textSpan);
				prevTextWrap.append(textCloneSpan);
			});
			mainSwiper.append(prevTextWrap, nextTextWrap);
			createTextState = false;
		}

		// 자동차 이름값 추가 후 텍스트 인터렉션
		function textIndexStart(isSwiper){
			let prevText =  document.querySelectorAll('.prev_txt span');
			let nextText =  document.querySelectorAll('.next_txt span');
			let index = isSwiper.activeIndex;

			for(let i = 0; i < isSwiper.slides.length; i++){
				prevText[i].classList.remove('view-interaction');
				nextText[i].classList.remove('view-interaction');
			}

			setTimeout(() => {
				prevText[index-1].classList.add('view-interaction');
				nextText[index+1].classList.add('view-interaction');
				prevText[index].classList.add('visible-interaction');
				nextText[index].classList.add('visible-interaction');
			},100)
		}

		// 자동차 이름값 추가 후 텍스트 인터렉션 끝
		function textIndexEnd(isSwiper){
			let prevText =  document.querySelectorAll('.prev_txt span');
			let nextText =  document.querySelectorAll('.next_txt span');

			for(let i = 0; i < isSwiper.slides.length; i++){
				prevText[i].classList.remove('visible-interaction');
				nextText[i].classList.remove('visible-interaction');
			}
		}


		// 메인 비쥬얼 스와이퍼 정지, 시작 버튼
		function swiperControler(){
			let swiperControlerButton = document.querySelectorAll('[class^="swiper-controler"]');
			let swiperControlerPause = document.querySelector('.swiper-controler-pause');
			let swiperControlerPlay = document.querySelector('.swiper-controler-play');
			
			swiperControlerPause.addEventListener('click',function(e){
				swiperControlerButton.forEach(element => {
					element.classList.add('active');
				});
				mainSwiper.autoplay.stop();
				e.target.classList.remove('active');
			})
			swiperControlerPlay.addEventListener('click',function(e){
				swiperControlerButton.forEach(element => {
					element.classList.add('active');
				});
				mainSwiper.autoplay.start();
				e.target.classList.remove('active');
			})
		}


		// '모델로 검색하세요.' 스와이퍼
		const selectSwiper = new Swiper('.model_swiper', getSwiperOption({
			target : '.model_swiper',
			slidesPerView : 5,
			spaceBetween: 8,
			navigation : true,
			navigation_cls: 'model_type',
			addOption : {
				slidesPerGroup : 5,
				speed: 1000,
				on : {
					slideChangeTransitionStart: function(){ // 추후 스와이퍼 작동 시 조건에 따라 수시로 여백 변경 - line 220 ~ 226
						swiperSizing(this);
					},
					sliderFirstMove : function(){ // 처음 스와이퍼 시작 시 이벤트
						swiperSizing(this);
					},
					init : function(){
						this.wrapperEl.closest('.model_swiper').style.paddingRight = '148px'; //초기값
					}
				},
			}
		}))

		// '모델로 검색하세요.' 스와이퍼
		// 좌우 버튼 간격 조정 함수
		// 해당 스와이퍼 스와이핑 시 좌/우 여백을 위해 간격 조정
		function swiperSizing(swiper){
			let wrap = swiper.wrapperEl.closest('.model_swiper');
			let prevBtn = wrap.querySelector('.swiper-button-prev');
			
			if(!prevBtn.classList.contains('swiper-button-disabled')){
				wrap.style.paddingLeft = '40px';
				wrap.style.paddingRight = '108px';
			}else{
				wrap.style.paddingLeft = '0';
				wrap.style.paddingRight = '148px';
			}
		}

		// '모델로 검색하세요.' 스와이퍼
		// 13개 차량 클릭시 차종 선택 팝업 함수
		function modelChkPop(){
			let modelList = document.querySelector('.model_list');
			let modelSelectItem = modelList.querySelectorAll('.model_select_item');
			let modelSelectName = modelList.querySelectorAll('.model_select_item .model_name');
			let modelChk = modelList.querySelectorAll('.sel_model_list > li');
			let selModelDelete = modelList.querySelector('.sel_model_delete');
			
			selModelDelete.addEventListener('click', function(e){
				e.target.closest('.sel_model').classList.remove('on');

				for(let i = 0; i < modelSelectItem.length; i++){
					modelSelectItem[i].classList.add('on');
					modelSelectName[i].classList.add('no_selected');
				}
			})
			
			modelSelectItem.forEach(el => {
				el.addEventListener('click',function(){
					let _this = event.target.closest('.model_select_item');

					for(let i = 0; i < modelSelectItem.length; i++){
						modelSelectItem[i].classList.remove('on');
						modelSelectName[i].classList.remove('no_selected');
					}

					_this.classList.add('on');

					modelChk.forEach(element => {
						element.classList.remove('on');
						
						if(_this.dataset.select == element.dataset.selectFor){
							element.classList.add('on');
							element.closest('.sel_model').classList.add('on');
						}
					});
				})
			});
		}

		modelChkPop(); // 모델 선택 스와이퍼  

		// 인기차량 스와이퍼 썸네일
		const halfThumSwiper = new Swiper('.half_thumb_swiper', getSwiperOption({
			target: '.half_thumb_swiper',
			spaceBetween: 20,
			slidesPerView: "auto",
			loop: true,
			addOption: {
				watchSlidesProgress: true,
				allowTouchMove : false,
				loopAdditionalSlides : 30,
			}
		}))
		// 인기차량 메인 스와이퍼
		const halfSwiper = new Swiper('.half_swiper', getSwiperOption({
			target : '.half_swiper',
			slidesPerView : 1,
			navigation : true,
			navigation_cls: 'type05',
			navigationContainer : 'half_nav_container',
			loop : true,
			addOption:{
				effect: "fade",
				thumbs: {
				swiper: halfThumSwiper,
				},
			}
		}))

		// 자주묻는 질문 스와이퍼
		const QnASwiper = new Swiper('.qna_swiper', getSwiperOption({
			target: '.qna_swiper',
			spaceBetween: 20,
			slidesPerView: 4,
			pagination: true,
			loop: true,
			navigation : true,
			navigation_cls : 'type03',
			addOption : {
				slidesPerGroup : 4,
			}
		}))



		// 인기차량 이후 섹션 인터렉션
		function parallexfn(){
			let parallex = document.querySelector('.script--parallax');
			let parallexItem = document.querySelectorAll('.script--parallax > *');
			let html = document.querySelector('html');
			let parallexPrev = document.querySelector('.script--no--parallax');
			let parallexEnd = document.querySelector('.parallex_end');
			let floatingTop = document.getElementById('CPOfloating').querySelector('[title="top"]');
			let scrolllingState = true;
			let endBollean = null;
			let end = false;
			let maxIndex = parallexItem.length ;
			let deltaArr = [];
			
			floatingTop.addEventListener('click',(e)=>{
				scrollInit()
			})

			function scrollInit(){
				setTimeout(()=>{
					html.style = "";
				},2000)
				parallex.style = "";
				scrolllingState = true;
				scrollCount = 0;
			}
			parallexPrev.addEventListener('wheel', (e) => {
				let prevPosition = Math.floor(parallexPrev.getBoundingClientRect().top + parallexPrev.getBoundingClientRect().height);

				if(window.innerHeight >= prevPosition && e.deltaY > 0) nextInteraction(0);
			})
		
			parallexItem.forEach((el,index)=>{
				el.addEventListener('wheel', (e) =>{
					parallexPrev.removeEventListener('wheel',(e)=>{});
					let els = Math.floor(parallexPrev.getBoundingClientRect().top + parallexPrev.getBoundingClientRect().height);
					let wh = Math.floor(window.innerHeight);
					
					endBollean = e.target.closest('.parallex_end');
					if( wh >= els && !endBollean){
						if(e.deltaY > 0){
							nextInteraction(index+1);
						}else if(e.deltaY < 0){
							prevInteraction(index-1,e);
						}
					}else if(endBollean){
						if(e.deltaY < 0){
							if(parallexEnd.scrollHeight > wh){
								if(parallexEnd.scrollTop == 0){
									prevInteraction(index-1,e);
								}
							}else{
								prevInteraction(index-1,e);
							}
						}
					}
				})
			})
			
			
			
			function focusAimation(count){
				if(end){
					parallex.style.top = -((window.innerHeight * count)-1) + -(parallexEnd.getBoundingClientRect().height)  + 'px';
					console.log(-((window.innerHeight * count)-1) + -(parallexEnd.getBoundingClientRect().height)  + 'px')
					end = false;
				}else{
					parallex.style.top = -((window.innerHeight * count)-1) + 'px';
				}
				scrolllingState = false;
				setTimeout(()=>{
					scrolllingState = true;
				}, 1000);
			}

			function nextInteraction(count){
				html.style.overflow = 'hidden';
				if(count <= maxIndex && scrolllingState){
					focusAimation(count);
					if(count == maxIndex - 1){
						end = true;
						count = 2;
						let headerBoolean = document.getElementById('CPOheader').classList.contains('fixed');
						if(headerBoolean && window.innerHeight <= parallexEnd.getBoundingClientRect().height){
							setTimeout(()=>{
								parallexEnd.style.paddingTop = '70px';
							}, 1000);
						}else{
							parallexEnd.style.paddingTop = '';
						}
						focusAimation(count);
					}
				}
			}

			function prevInteraction(count, event){
				if(count <= maxIndex && scrolllingState){
					let endHeight =  Math.floor(parallexEnd.getBoundingClientRect().top + parallexEnd.getBoundingClientRect().height)
					parallexEnd.style.paddingTop = '0';
					if(count == -1){
						parallex.style.top = window.innerHeight + 'px';
						html.style = '';
						scrolllingState = true;
					}else if(endHeight == window.innerHeight){
					}else{
						focusAimation(count);
					}
				}
			}
			
			window.onload = () => {
				if(window.innerHeight < parallexEnd.getBoundingClientRect().height){
					responsive() 
				}
			}
			window.onresize = () =>{
				if(window.innerHeight < parallexEnd.getBoundingClientRect().height){
					responsive()
				}
			}

			function responsive(){ // 윈도우의 높이값이 
					parallexEnd.style.height = '100vh';
					parallexEnd.style.overflowY = 'scroll';
			}
		}

		parallexfn();
	}
  }