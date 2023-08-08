var UI = UI || {};
UI.hasJqueryObject = function ($el) {
    return $el.length > 0;
};

// layout setting
UI.layoutSet = {
    init: function () {
        this.$wrap = UI.$body.find("#wrap");
        this.$fixTop = this.$wrap.find("[data-ui-fixed='top']");
        this.$fixBtm = this.$wrap.find("[data-ui-fixed='bottom']");
        this.addEvents();
    },
    addEvents: function () {
        var topH = this.$fixTop.outerHeight();
        var btmH = this.$fixBtm.outerHeight();

        this.$wrap.css("padding-top", topH);
        this.$wrap.css("padding-bottom", btmH);

    }
};

// 바디 스크롤 제어
var scrollHeight = 0;
UI.scrollSet = {
    init: function (type) {
        this.$wrap = UI.$body.find("#wrap");
        // 바디스크롤 제거
        if (type === "off") {
            scrollHeight = $(document).scrollTop();
            UI.$body.css("overflow", "hidden");
            this.$wrap.css("position", "fixed");
            this.$wrap.css("top", -scrollHeight);
            return scrollHeight;
        // 바디스크롤 제거 해제
        } else if (type === "on") {
            UI.$body.css("overflow", "");
            this.$wrap.css("position", "relative");
            this.$wrap.css("top", 0);
            $(document).scrollTop(scrollHeight);
        }
    }
}

// 팝업 열기
UI.popupOpen = {
    init: function (obj, callback) {
        var popTarget = $("#pop-" + obj);
        popTarget.show().addClass("show");

        if (popTarget.hasClass("ndim")) {
            popTarget.css("left", 0);
        }

        UI.scrollSet.init("off"); // 바디스크롤 제거

        // 토스트 팝업
        if (popTarget.hasClass("ly_toast")) {
            setTimeout(function () {
            if (callback && typeof (callback) === "function") {
                callback();
            }
            }, 1500);

        }

        // 영역 외 클릭 닫기
        popTarget.off("click.popClose").on("click.popOpen", function (e) {
            if (!$(this).hasClass('ndim')) {
            if (!$('[class*="ly"]').find('.wrap').has(e.target).length) {
                UI.popupClose.init(obj, 'mwf');
            }
            }
        });
    }
};

// 팝업 닫기
UI.popupClose = {
    init: function (obj) {
        var popTarget = $("#pop-" + obj);

        if (popTarget.hasClass('ly_btm')) {
            popTarget.removeClass('show');
        } else {
            popTarget.hide();
        }

        UI.scrollSet.init("on");
    }
};

UI.dim = {
    on: function() {
        if(!$("#header").children(".dim").length) {
            $('body').css('overflow', 'hidden');
            $("#header").append("<div class='ly-dim'></div>");
        }  
    },
    off: function() {
        $('body').css('overflow', '');
        $("#header").find(".ly-dim").remove();
    }
}

UI.allMenu = {
    init: function() {
        this.$btnOpen = UI.$body.find(".btn-menu-open");
        this.$allMenuWrap = UI.$body.find(".ly-menu-wrap");
        this.$btnClose = this.$allMenuWrap.find(".btn-menu-close");
        this.addEvents();
    },
    addEvents: function() {
        var _this = this;
        _this.$btnOpen.off("click.openAllMenu").on("click.openAllMenu", function(){
            _this.handleOpen();
        });
        _this.$btnClose.off("click.closeAllMenu").on("click.closeAllMenu", function(){
            _this.handleClose();
        });
    },
    handleOpen: function(){
        UI.dim.on();
        UI.allMenu.$allMenuWrap.css("display", "block");
        setTimeout( function() {
            UI.allMenu.$allMenuWrap.addClass("on");
        }, 100);
    },
    handleClose: function(){
        UI.allMenu.$allMenuWrap.removeClass("on");
        setTimeout( function() {
            UI.allMenu.$allMenuWrap.css("display", "none");
        }, 100);
        UI.dim.off();
        UI.allMenu.$btnOpen.focus();
    }
}

UI.scrollTop = {
    init: function () {
        this.$btnTop = UI.$body.find(".btn-top");
        this.addEvents();
    },
    addEvents: function () {
        var _this = this;
        var lastScrollTop = 0;
        $(window).scroll(function(){
            var st = $(this).scrollTop();
            if(st > lastScrollTop && st > 50){
                _this.$btnTop.show();
            }else{
                _this.$btnTop.hide();
            }
        });
        _this.$btnTop.off("click.top").on("click.top", function(){
            $('html,body').animate({scrollTop :0}, 200);
        });
    }
};

UI.ipFocus = {
    init: function() {
        this.$inputWrap = UI.$body.find(".ip-box");
        this.$ip = this.$inputWrap.find(".ip");
        this.addEvents();
    },
    addEvents: function() {
        var _this = this;
        _this.$ip.each(function(idx){
            var _input = $(this), _par = $(this).parent(), _wrap = $(this).parents(".ip-wrap");
            _input.on("focus", function () {
                _par.addClass('focus');
            }).on("blur", function (e) {
                _par.removeClass('focus');
                if(_par.children('textarea').length){
                    _par.addClass('textarea');
                }
                
                if(!$.trim($(this).val()) == "" ) {
                    _par.find('.lbl').hide();
                }else{
                    _par.find('.lbl').show();
                }
            }).blur();
            _input.on("keyup", function () {
                if(!$.trim($(this).val()) == "" ) {
                    _par.find('.lbl').hide();
                }
            });
        });
    }
}

UI.scheduleSwiper = {
    init: function () {
        $(".schedule-swiper").each(function(idx){
            if($(".schedule-swiper").eq(idx).find(".swiper-slide").length > 1) {
                var $this = $(this);
                $this.addClass('data-idx-' + idx);
                var swiper = new Swiper('.data-idx-' + idx, {
                    observer: true,
                    observeParents: true,
                    loop:true,
                    centeredSlides: true,
                    slidesPerView: "auto"
                });
            }else {
                $(".schedule-swiper").eq(idx).find(".swiper-slide").addClass("swiper-slide-active");
            }
        });
    }
};

UI.acco = {
    init: function() {
        this.$accoWrap = UI.$body.find(".acco-list");
        this.$accoItem = this.$accoWrap.find(".item");
        this.$accoTit = this.$accoWrap.find(".btn");
        this.$accoTitActive = this.$accoWrap.find(".btn.on");
        this.$accoCont = this.$accoWrap.find(".cont");
        this.addEvents();
    },
    addEvents: function() {
        var _this = this;
        function handleToggle() {
            if($(this).hasClass('on')){
                _this.$accoCont.slideUp(200);
                _this.$accoItem.removeClass('on');
                $(this).removeClass('on');
            }else{
                _this.$accoCont.slideUp(200);
                _this.$accoTit.removeClass('on');
                _this.$accoItem.removeClass('on');
                $(this).parent().addClass('on')
                $(this).addClass('on').next().slideDown(200);
                $(this).addClass('on').next().scrollTop(0);
            }
        }
        _this.$accoTit.off('click.toggle').on('click.toggle', handleToggle);
    }
}

$(function(){
    UI.$window = $(window);
    UI.$body = $("body");
    if (UI.hasJqueryObject(UI.$body.find("#wrap"))) UI.layoutSet.init();
    if (UI.hasJqueryObject(UI.$body.find(".ly-menu-wrap"))) UI.allMenu.init();
    if (UI.hasJqueryObject(UI.$body.find(".btn-top"))) UI.scrollTop.init();
    if (UI.hasJqueryObject(UI.$body.find(".ip-wrap"))) UI.ipFocus.init();
    if (UI.hasJqueryObject(UI.$body.find(".schedule-swiper"))) UI.scheduleSwiper.init();
    if (UI.hasJqueryObject(UI.$body.find(".acco-list"))) UI.acco.init();
});