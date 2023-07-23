const express = require('express')
const router = express.Router()
const path = require('node:path'); 
const mysqlConnection = require('../mysqlConnector');

const recordController = require('../Controllers/articlesController');

router.use(logger)

router.get('/', recordController.getAllArticles)
router.get("/view_article/:id", recordController.viewArticleWithComments)
router.post("/view_article/post_comment", recordController.addComment)
router.post("/", recordController.postArticle)
router.get("/edit_article/:id", recordController.editArticle)

router.get("/delete_article", (request, response) => {
    
    mysqlConnection.query("DELETE FROM articles WHERE article_author = 'admin'", (err, result) => {
        if (err) {
            console.log(err)
        }
        response.render('article_deleted');
        console.log('Articles Have Been Deleted')
    })
}
)

router.get("/create_new_article", (request, response) => {
        response.render('new_article',);
    })



function logger(request, response, next){
    console.log(request.originalUrl)
    next()
}

module.exports = router;