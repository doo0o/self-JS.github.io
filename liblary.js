let USER_EMAIL = document.getElementById('getEmail');
let EMAIL_ARRAY = [];

USER_EMAIL.addEventListener('keyup',(e)=>{

	// 엔터누르면 배열 갯수 1 이상 push X
	if(e.key == "Enter" && EMAIL_ARRAY.length < 1){
		EMAIL_ARRAY.push(USER_EMAIL.value);

		console.log(EMAIL_ARRAY)
		// 1개의 배열의 length
		if(EMAIL_ARRAY.length == 1){
			for(i = 1; i < 4; i++){
				console.log(EMAIL_ARRAY[EMAIL_ARRAY[0].length - i])
			}
		}
	}

	// alert(`회원님의 이메일 주소 ${result}로 메일을 발송했습니다.`);
})




// 문자열 **** 처리
function stringToStar(str){
	str = '*';
}