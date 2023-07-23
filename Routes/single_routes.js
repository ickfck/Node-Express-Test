const express = require('express')
const router = express.Router()
const path = require('node:path'); 

router.use(logger)

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

function logger(request, response, next){
    console.log(request.originalUrl)
    next()
}

module.exports = router;