let ww = window.innerWidth;
let url = new URL(window.location.href);
let goParams = url.searchParams.get('go');
let header = document.querySelector('.header');
let navLi = header.querySelectorAll('.scroll-nav__list > li');
let moNav = header.querySelectorAll('.header-menu__list > li');
let header_h = header.getBoundingClientRect().height;
setTimeout(()=>{
    let goSection = document.querySelector(`.${goParams}`);
    if(goSection){
        moveScroll(goSection)
    }
},250)

// 스크롤 시 헤더 class 제어
let scrollHeader = () => {
    if(window.scrollY > 0){
        header.classList.add('active');
    }else{
        header.classList.remove('active');
    }
}

// event binding
window.addEventListener('scroll',scrollEvt);
window.addEventListener('resize', ()=>{
    ww = window.innerWidth;
    headerNav(ww);
})

headerNav(ww);
function headerNav(ww){
    if(ww > 1024){
        navLi.forEach(el => {
            if(!el.classList.contains('type--link')){
                el.addEventListener('click',anchorLink);
            }
            // if(url.pathname){console.log}
        });
    }else if(ww < 1024){
        moNav.forEach(el => {
            if(!el.classList.contains('type--link')){
                el.addEventListener('click',anchorLink);
            }
        });
    }
}

// 화면에 보일 때 인터렉션
const io = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting){
             entry.target.classList.add('bottom-to-top');
        } 
    });
})
let observeTarget = document.querySelectorAll('[data-io]');
let io_option = {
    threshold: 0.3,
}

observeTarget.forEach(el => {
    if(el.dataset.io == 'true'){
        io.observe(el)
    }
});

function anchorLink(){
    let _this = event.target;
    let getData = _this.dataset.targetClass;
    let dataHaveEl = document.querySelector(`.${getData}`)
    if(_this.closest('.isSub')){
        window.location.href = `${mainUrl}?go=${getData}`
    }
    moveScroll(dataHaveEl)
    activeOn(_this);
}
function moveScroll(target){
    if(target){
        const absoluteY = window.pageYOffset + target.getBoundingClientRect().top;
        window.scrollTo({
            top : absoluteY - header_h,
            behavior : "smooth",
        });
    }
}
function activeOn(target){
    target.closest('ul').querySelectorAll('li').forEach(el => {
        el.closest('li').classList.remove('on');
    });
    target.closest('li').classList.add('on');
}

function scrollEvt(){
    scrollHeader();
}

