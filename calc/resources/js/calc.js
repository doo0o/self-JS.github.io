// tab
const tab = document.querySelectorAll('[data-ref="tab"]');
// input 
let typeInput = document.querySelectorAll(".tab--contents input[type='text']");

// event 바인딩
tab.forEach( el =>{
    const tabButtons = el.querySelectorAll('ul > li button');
    const tabContents = el.querySelectorAll('.tab--contents');  
    tabButtons.forEach((el,index) => {
        // event
        el.addEventListener('click', ()=>{
            tabfn(tabButtons,tabContents,index);
        })
    });
})
    
typeInput.forEach(el => {
    el.addEventListener('focus',()=>{
        focusFn(el);
    })
});

// tab 함수
function tabfn(tabButtons,tabContents,targetIndex){
    for(i = 0; i < tabButtons.length; i++){
        tabButtons[i].classList.remove('on'); //init
        tabContents[i].classList.remove('on'); //init
    }
    if(!event.target.classList.contains('on')){
        event.target.classList.add('on');
        tabContents[targetIndex].classList.add('on');
    }
}

function focusFn(el){
    // focus
    for(i = 0; i < typeInput.length; i++){
        typeInput[i].closest('.input__box').classList.remove('focus');
    }//init
    el.closest('.input__box').classList.add('focus'); // add focus
}

function keyUpFn(){ // 인풋 입력 이벤트 시
    //  전역변수 선언
    let e = event; // event object
    let KEY_Result = 0;

    if(e.target.dataset.stock !== "charge"){ // 수수료 제외        
        KEY_Result = numberWithCommas(chkNumber(e.target.value));
        e.target.value = KEY_Result;
    }else{
        e.target.value = decimalNumber(e.target.value);
    }
    
    calc_result(KEY_Result,e);
}

function calc_result(pr,e){ // pr = 콤마등 가공된 변수,  or = 순수 number type의 값
    let revenue = document.querySelector('[data-stock="revenue"]');
    let averageCost = document.querySelector('[data-stock="averageCost"]');

    let revenue_result = document.querySelector('[data-stock="revenue"] .result');
    let averageCost_result = document.querySelector('[data-stock="averageCost"] .result');
    let input_arr = [];
    let STOCK_Data = [];

    if(revenue.classList.contains('on')){ // 수익률 계산 탭 활성
        let input_item = revenue.querySelectorAll('.input__box input[data-stock]');
        let output_item = revenue.querySelectorAll('.return--data'); // 유사 배열로써 사용
        
        input_item.forEach((el,index) => {
            let status = el.value ? true : false;
            input_arr.push(status);
            STOCK_Data.push(Number(el.value.split(',').join('')));
        })
        if(!STOCK_Data[3]){
            STOCK_Data[3] = 0.015;
        }            
        input_arr[3] = true;
        
        //수익률 계산 값 전부 입력되었을 때
        if(!input_arr.includes(false)){
            /*    Number Type
                - STOCK_Data[0] : 매수단가
                - STOCK_Data[1] : 매도수량
                - STOCK_Data[2] : 매도단가
                - STOCK_Data[3] : 증권사 수수료
            */


            STOCK_Data[3] = parseFloat(STOCK_Data[3] * 0.01)
            
           // 매수금액 output_item[2]
            let op01 = STOCK_Data[0] * STOCK_Data[1];
            output_item[2].innerText = numberWithCommas(Math.round(op01));
               
           // 매도금액 output_item[3]
            let op02 = STOCK_Data[2] * STOCK_Data[1];
            output_item[3].innerText = numberWithCommas(Math.round(op02));

            // 수수료 output_item[4]
            let op03 = (op01 * STOCK_Data[3]) + (op02 * STOCK_Data[3]);
            output_item[4].innerText = numberWithCommas(Math.round(op03));

            // 거래세 output_item[5]
            let op04 = op02 * 0.002;
            output_item[5].innerText = numberWithCommas(Math.round(op04));

            // 손익 output_item[0]
            let op05 = (op02 - op01) - (op03 + op04);
            output_item[0].innerText = numberWithCommas(Math.round(op05));

            if(op05 > 0){
                revenue_result.classList.add('plus');
                revenue_result.classList.remove('minus');
            }else if(op05 < 0){
                revenue_result.classList.add('minus');
                revenue_result.classList.remove('plus');
            }else{
                revenue_result.classList.remove('plus');
                revenue_result.classList.remove('minus');
            }
            
            // 수익률 output_item[1]
            let op06 = (op05 / op01) * 100;
            output_item[1].innerText = numberWithCommas(op06.toFixed(2));
        }
    }

    if(averageCost.classList.contains('on')){// 평단가 계산 값 전부 입력되었을 때
        let input_item = averageCost.querySelectorAll('.input__box input[data-stock]');
        let output_item = averageCost.querySelectorAll('.return--data'); // 유사 배열로써 사용
        
        input_item.forEach((el,index) => {
            let status = el.value ? true : false;
            input_arr.push(status);
            
            STOCK_Data.push(Number(el.value.split(',').join('')));
        })
               
        //수익률 계산 값 전부 입력되었을 때
        if(!input_arr.includes(false)){
            /*
                - STOCK_Data[0] : 현재가
                - STOCK_Data[1] : 기존보유 : 단가
                - STOCK_Data[2] : 기존보유 : 수량
                - STOCK_Data[3] : 추가매수 : 단가
                - STOCK_Data[4] : 추가매수 : 수량
            */
            
           // 총 보유 수량 output_item[1]
            let op01 = STOCK_Data[2] + STOCK_Data[4];
            output_item[1].innerText = numberWithCommas(Math.round(op01));
               
           // 총 매입 금액 output_item[2]
            let op02 = (STOCK_Data[1] * STOCK_Data[2]) + (STOCK_Data[3] * STOCK_Data[4]);
            output_item[2].innerText = numberWithCommas(Math.round(op02));


            // 평단가 output_item[0]
            let op03 = op02 / op01;
            output_item[0].innerText = numberWithCommas(Math.round(op03));

            // 손익 output_item[3]
            let op04 = (STOCK_Data[0] * op01) - (op03 * op01);
            output_item[3].innerText = numberWithCommas(Math.round(op04));

            // 수익율 output_item[5]
            let op05 = (op04 / op02) * 100 ;
            output_item[4].innerText = numberWithCommas(op05.toFixed(2));


            if(op04 > 0){
                averageCost_result.classList.add('plus');
                averageCost_result.classList.remove('minus');
            }else if(op04 < 0){
                averageCost_result.classList.add('minus');
                averageCost_result.classList.remove('plus');
            }else{
                averageCost_result.classList.remove('plus');
                averageCost_result.classList.remove('minus');
            }
        }
    }
}

// 천단위 콤마 (소수점포함)
function numberWithCommas(num) {
	var parts = num.toString().split(".");
	return parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ",") + (parts[1] ? "." + parts[1] : "");
}

// 숫자 체크(숫자 이외 값 모두 제거)
function chkNumber(num){
	var tmpValue = num.replace(/[^0-9,]/g,'');
	tmpValue = tmpValue.replace(/[,]/g,'');
	return tmpValue;
}

// 소숫점
function decimalNumber(num) {
    // 숫자와 소수점을 제외한 문자를 모두 제거
    num = num.replace(/[^\d.]/g, '');

    // 소수점이 두 번 이상 입력되는 경우 첫 번째 소수점 이후의 모든 소수점을 제거
    const decimalIndex = num.indexOf('.');
    if (decimalIndex !== -1 && num.indexOf('.', decimalIndex + 1) !== -1) {
        num = num.slice(0, decimalIndex + 1) + num.slice(decimalIndex + 1).replace(/\./g, '');
    }

    return num;
}
