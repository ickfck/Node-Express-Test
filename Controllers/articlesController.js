const mysqlConnection = require('../mysqlConnector');

exports.getAllArticles = (request, response) => {
    const query = 'SELECT * FROM records';
    mysqlConnection.query(query, (err, records) => {
    mysqlConnection.query('SELECT * FROM articles ORDER BY article_date DESC', (err, result1) => {
    if (err) {
    console.log(err)
    }
    const data_articles = {data_articles: result1}
    response.render('articles', data_articles);
    console.log(data_articles);
        })
    })}

exports.viewArticle =  (request, response) => {
const article_id = request.params.id;
var query = 'SELECT * FROM articles WHERE article_id=?'
mysqlConnection.query(query, [article_id], (err, result) => {
if (err) {
console.log(err)
}
console.log(result);
response.render('view_article',{data_articles: result});
})}

exports.postArticle = (request, response) => {
const article_title = request.body.article_title;
const article_author = request.body.article_author;
const article_text = request.body.article_text        
mysqlConnection.query('INSERT INTO articles (article_author, article_title, article_text, article_date) VALUES (?, ?, ?, Current_Date())', [article_author, article_title, article_text], (err, result) => {
if (err) {
console.log(err)
}
mysqlConnection.query('SELECT * FROM articles', (err, result1) => {
if (err) {
console.log(err)
}
const data_articles = {data_articles: result1}
response.render('articles', data_articles);
console.log('Article created');
})
console.log('Article ' + article_title + 'Has Been Created')
})
}

exports.editArticle = (request, response) => {
const articleId = request.params.id;

mysqlConnection.query('SELECT * FROM articles WHERE article_id=?', [articleId], (err, rows) => {
if (err) {
console.log(err);
} else {
response.render('admin_edit_article', { data: rows[0] }); // Assuming there is only one user with the given ID, so we pass rows[0] to access that user's data.
console.log('Edit User');
}
});
}

exports.viewArticleWithComments = async (req, res) => {
const articleId = req.params.id;

try {
// Fetch the article from the database
const articleQuery = 'SELECT * FROM articles WHERE article_id = ?';
const article = await queryToPromise(articleQuery, [articleId]);

// Fetch the comments related to the article from the database
const commentsQuery = 'SELECT * FROM comments WHERE article_id = ?';
const comments = await queryToPromise(commentsQuery, [articleId]);

res.render('view_article', { data_articles: article, data_comments: comments });
} catch (err) {
console.error(err);
res.status(500).send('Error fetching article and comments');
}
};

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


exports.addComment = async (req, res) => {
const articleId = req.body.article_id;
const commentText = req.body.comment_text; // Assuming the comment text is sent in the request body

try {
const addCommentQuery = 'INSERT INTO comments (comment_author, comment_text, comment_create_date, article_id) VALUES (?, ?, current_Date(), ?)';
const values = ['Admin', commentText, articleId];

const comment = await queryToPromise(addCommentQuery, values);
console.log(comment);

// Fetch the article from the database
const articleQuery = 'SELECT * FROM articles WHERE article_id = ?';
const article = await queryToPromise(articleQuery, [articleId]);

// Fetch the comments related to the article from the database
const commentsQuery = 'SELECT * FROM comments WHERE article_id = ?';
const comments = await queryToPromise(commentsQuery, [articleId]);

res.render('view_article', { data_articles: article, data_comments: comments });
} catch (err) {
console.error(err);
res.status(500).send('Error fetching article and comments');
}
};

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



