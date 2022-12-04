module.exports={
    getID :`select userid from users`,
    
    userInsert: `insert into users set ?`,

    getPassword : 'select pwd,salt from users where userid = ? '
}