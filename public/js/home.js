

async function logout(){
    console.log("로그아웃 버튼 눌림!!");
    
   const result =  await axios.post('/serverclient/logout',(req,res)=>{
    
    });
    console.log("로그아웃");
    location.href = '/';
    sessionStorage.setItem("jwtToken","");
}