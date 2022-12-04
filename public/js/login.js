const { Session } = require("session/lib/session");


console.log("login.js")

async function submit(){
    
    var userid = document.getElementById('userid').value;
    var userpwd = document.getElementById('userpwd').value;
    //비번 인코딩
    var encodedPwd = window.btoa(userpwd);

    var Msg = document.querySelector('#Msg');

    var sql={
       params:{userid : userid,
       userpwd : encodedPwd,}
    }
    const result = await axios.get('/serverclient/logincheck',sql)
    console.log(result.data);
    console.log("토큰값::",result.data.token);
    sessionStorage.setItem("jwtToken", result.data.token);
    //로그인 성공
    if(result.data.data === 1){
        //토큰 세션 스토리지에 저장하기
        console.log(`userid is ${userid}`)
        location.href = `/home?${userid}`;
        
    }
    else{
        Msg.innerHTML = result.data;
    }
    
}

