const express = require('express')
const router = express.Router()
const path = require('node:path'); 
const mysqlConnection = require('../mysqlConnector');

router.use(logger)

const recordController = require('../Controllers/articlesController');

router.get("/", (request, response) => {
    mysqlConnection.query('SELECT * FROM articles', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result);
        response.render('admin', {data: result});
        })
}) 

router.get("/admin_articles", (request, response) => {
    mysqlConnection.query('SELECT * FROM articles', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result);
        response.render('admin_articles', {data: result});
        })
})

router.get("/admin_comments", (request, response) => {    
        response.render('admin_comments',);
        })

router.get("/delete_user", (request, response) => {    
        response.render('admin_users',);
        })        

router.get("/admin_users", (request, response) => {
    mysqlConnection.query('SELECT * FROM users', (err, result) => {
        if (err) {
            console.log(err)
        }
        console.log(result);
        response.render('admin_users', {data: result});
        })
})

function logger(request, response, next){
    console.log(request.originalUrl)
    next()
}

module.exports = router;