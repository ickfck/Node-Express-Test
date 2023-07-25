const express = require('express')
require('dotenv').config()
const router = express.Router()
var bcrypt = require('bcrypt');
const { promisify } = require('util');
const mysqlConnection = require('../mysqlConnector');
const jwt = require('jsonwebtoken')
const cookieParser = require('cookie-parser');

router.use(cookieParser())
router.use(logger)

const userController = require('../Controllers/usersController');
const { stat } = require('fs');

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
        const statusLog = "You have been registered."
        response.render('register', { statusLog })
    } 
    else {
        console.log('No Match')
        const statusLog = "Your password and password confirmation don't match."
        response.render('register', { statusLog } )
    }    

})

const comparePasswords = promisify(bcrypt.compare);

router.post('/login', async (request, response) => {
    const user_password = request.body.user_password;
    const user_name = request.body.user_name;
    const UserAuthenticationQuery = 'SELECT * FROM users WHERE user_name = ?';

    try {
        const login = await queryToPromise(UserAuthenticationQuery, [user_name]);

        if (login.length === 0) {
            const statusLog = 'User not registered';
            console.log(statusLog);
            response.render('login', { statusLog });
        } else {
            const stored_hashed_password = login[0].user_password;
            const result = await comparePasswords(user_password, stored_hashed_password);
            if (result) {
                console.log('User Authenticated');
                const user = { name: user_name };
                const accessToken = jwt.sign(user, process.env.ACCESS_TOKEN_SECRET);
                response.cookie("token", accessToken, {
                    httpOnly: true,
                });
                console.log(accessToken);
                console.log(user);
                const statusLog = 'You have been logged in as ' + user_name;
                console.log(statusLog);
                request.user = user;
                response.render('login', { statusLog });
            } else {
                const statusLog = 'User authentication Failed';
                console.log('User authentication Failed');
                response.render('login', { statusLog });
            }
        }
    } catch (err) {
        console.error('Error:', err);
    }
});

router.get("/admin", tokenAuthentication, (request, response) => {
    const user = request.user;
    if (user.name == "wellbi") {
    mysqlConnection.query('SELECT * FROM articles', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result.rows);
        response.render('admin', { data: result});
        })} else {
            console.log('Failed token Authentication')
            const statusLog = 'Failed token Authentication'
            response.render('./', { statusLog })
        }
}) 

function tokenAuthentication(request, response, next) {
    const token = request.cookies.token;
     console.log(token)
     try {
        const user = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
        request.user = user;
        next();
     } catch (err) {
        response.clearCookie("token");
        return response.redirect('/')
  }}

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