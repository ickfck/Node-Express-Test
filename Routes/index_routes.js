const express = require('express')
const router = express.Router()
var bcrypt = require('bcrypt');
const mysqlConnection = require('../mysqlConnector');

router.use(logger)

const userController = require('../Controllers/usersController')

router.get("/Experience", (request, response) => {
    response.render('experience');
}) 

router.get("/Template", (request, response) => {
    response.render('template');
}) 

router.get("/About", (request, response) => {
    response.render('about');
}) 

router.get("/Forum", (request, response) => {
    response.render('forum');
}) 

router.get('/login', (request, response) => {
    response.render('login')
})

router.get('/register', (request,response) => {
    response.render('register')
})

router.post('/register', async (request, response) => {
    
    console.log(request.body)
    const user_name = request.body.user_name
    const user_email = request.body.user_email
    const user_password = request.body.user_password
    const user_password_re = request.body.user_password_re;
    if (user_password == user_password_re) {
        console.log('Match')q
        var saltRounds = 10;  
        bcrypt.hash(user_password, saltRounds, function(err, hash) {            
            const registerUserQuery = 'INSERT INTO users (`user_name`, `user_password`, `user_create_date`, `user_email`) VALUES (?, ?, Current_Date(), ?)'
            const comment = queryToPromise(registerUserQuery, [user_name, hash, user_email]);            
            console.log('success')
        });
        response.render('register')
    } 
    else {
        console.log('No Match')
        response.render('register')
    }    

})

router.post('/login', async (request, response) => {
    console.log(request.body)
    response.render('login')
  
})

function logger(request, response, next){
    console.log(request.originalUrl)
    next()
}

function queryToPromise(query, values) {
    return new Promise((resolve, reject) => {
    mysqlConnection.query(query, values, (err, rows) => {
    if (err) {
    reject(err);
    } else {
    resolve(rows);
    }
    });
    })};

module.exports = router;