    const express = require('express')
    const router = express.Router()
    const path = require('node:path'); 
    const mysqlConnection = require('../mysqlConnector');

    const recordController = require('../Controllers/articlesController');

    router.use(logger)

    router.get('/', (request, response) => (
        response.render('forum')
    ))

    function logger(request, response, next){
        console.log(request.originalUrl)
        const originalUrl = request.originalUrl;
        next()
    }
 
module.exports = router;