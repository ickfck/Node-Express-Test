const express = require('express')
require('dotenv').config()
const router = express.Router()
var bcrypt = require('bcrypt');
const { promisify } = require('util');
const mysqlConnection = require('../mysqlConnector');
const jwt = require('jsonwebtoken')

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
        console.log('Match')
        var saltRounds = 10;  
        bcrypt.hash(user_password, saltRounds, function(err, hash) {            
            const registerUserQuery = 'INSERT INTO users (`user_name`, `user_password`, `user_create_date`, `user_email`) VALUES (?, ?, Current_Date(), ?)'
            const register = queryToPromise(registerUserQuery, [user_name, hash, user_email]);            
            console.log('success')
        });
        response.render('register')
    } 
    else {
        console.log('No Match')
        response.render('register')
    }    

})

const comparePasswords = promisify(bcrypt.compare);

router.post('/login', async (request, response) => {
    const user_password = request.body.user_password;
    const user_name = request.body.user_name;
    const UserAuthenticationQuery = 'SELECT * FROM users WHERE user_name = ?';

    try {
        const login = await queryToPromise(UserAuthenticationQuery, [user_name]);
        const stored_hashed_password = login[0].user_password;

        const result = await comparePasswords(user_password, stored_hashed_password);
        if (result) {
            console.log('User Authenticated');
            const user = { name: user_name };
            const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
            response.cookie("token", accessToken, { 
qq                
            })
            console.log(accessToken)
            console.log(user)
        } else {
            console.log('User authentication Failed');
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

router.get("/admin/", tokenAuthentication, (request, response) => {
    console.log(request.user)
    if (request.user == "wellbi") {
    mysqlConnection.query('SELECT * FROM articles', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result + 'KKK');
        response.render('admin', {data: result});
        })} else {
            console.log(nellbi)
        }
}) 

function tokenAuthentication(request, response, next) {
    const token = request.headers["authorization"];
    console.log(token);
    // const token  = authHeader && authHeader.split(' ')[1]
    if (token == null) return response.sendStatus(401)
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) return response.sendStatus(403)
        request.user = user
        console.log(user)
        next()
    })
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

    function logger(request, response, next){
        console.log(request.originalUrl)
        next()
    }
    

module.exports = router;