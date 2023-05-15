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