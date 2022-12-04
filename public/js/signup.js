
var validId = -1;// 중복체크 안함 -1,중복아이디 0, 유효아이디 1
var validPwd = 0;
var newId = '';
var newPwd = '';

function checkPW(){
    console.log("check pwd")
   // var userid = $('#userid').val();
    var pwd1 = document.getElementById('pwd1');
    var pwd2 = document.getElementById('pwd2');
   
    var pwd2Msg = document.querySelector('#pwd2Msg')
    

    

    if(pwd1.value !== pwd2.value){
        pwd2.classList.add("is-invalid");
        validPwd = 0;
       pwd2Msg.innerHTML = "비밀번호 불일치";
       
    }else{
        pwd2.classList.remove('is-invalid');
        validPwd = 1;
        newPwd = pwd2.value;
        pwd2Msg.innerHTML = "   ";
        
        
        
    }
    checkSubmit(); //submit 버튼 활성화할지 말지
}

async function checkID(){
    console.log('중복확인중');
    var userid = document.getElementById('userid');
    var idMsg = document.querySelector('#idMsg');
   if(userid.value===""){
        idMsg.innerHTML="아이디를 입력해주세요"
        return;
   }
    try{
        console.log(userid.value);
        var sendid = userid.value;
        var sql = {
            params:{
                id: sendid,

            }
        }
        const res = await axios.get('serverclient/checking_userid',sql);
        console.log('서버에 보냄');
        console.log(res.data);
        var checkValue = res.data;

    }catch(err){
        console.log(err);
    }

     //0이면 중복X, 1이면 중복O
    if(checkValue === -1){
        console.log("중복!");
        userid.classList.add("is-invalid");
        validId = 0;
        idMsg.innerHTML = "중복아이디";
    }
    else{
        console.log("중복아님!");
        userid.classList.remove("is-invalid");
        validId = 1;
        newId = userid.value;
        idMsg.innerHTML = "사용가능한 아이디";
    }
   
   checkSubmit();
};

function checkSubmit(){
    const btnSubmit = document.getElementById('btnSubmit');
    console.log("checking!~");
    if(validId === 1 && validPwd ===1){
        btnSubmit.classList.remove("disabled");
        console.log("가능"); return;
    }else if(validId === -1 && validPwd ===1){
        var idMsg = document.querySelector('#idMsg');
        idMsg.innerHTML="중복체크 해주세요";
        btnSubmit.classList.add("disabled");
        return;
    }
    else{
        btnSubmit.classList.add("disabled");
        console.log("불가능"); return;
    }
    


  
};

function updateID(){
    console.log("id수정")//중복체크를 안 했다면 중복체크 메시지, 아이디 input에 다시 접근했는데 수정하지 않았다면 아무일도 하지 않음, 수정했다면 다시 중복체크 요청, 회원가입 등록 버튼 비활성화 
    if(document.getElementById('userid').value === newId){
        return;
    }
    else{
    
    // var idMsg = document.querySelector('#idMsg');
    // if(validId == -1){
    //     return;
    // }
    // idMsg.innerHTML="중복체크 해주세요";

    validId = -1;
    checkSubmit();}
}


async function registerUser(){
    console.log("버튼눌림");
    //인코딩하기
   
    var encodePwd = window.btoa(newPwd);
    console.log("encoded pwd : ", encodePwd);
    var registerData  = [];
    registerData.push(newId);
    registerData.push(encodePwd);

    console.log(registerData);
    const result= await axios.post("/serverclient/registerUser",registerData)
    console.log(result);
    location.href="/login";
    
};

// function Base64Encode(str,encoding="utf-8"){
//     new (TextEncoder|| TextEncoderLite).encoding.encode(str);
//     return base64js.fromByteArray(bytes);
// }


