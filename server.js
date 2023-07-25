var express = require('express');
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken')
var app = express();

app.use(express.json())
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());


const recordController = require('./Controllers/articlesController');
app.use(express.static('Public'))

app.get("/", recordController.getAllArticles)

app.set('view engine', 'ejs')

//Routes
const indexRouter = require('./Routes/index_routes')
const forumRouter = require('./Routes/forum')
const usersRouter = require('./Routes/users')
const articlesRouter = require('./Routes/articles')
const adminRouter = require('./Routes/admin.js')

//Router Scopes
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/login', usersRouter);
app.use('/articles', articlesRouter);
app.use('/forum', forumRouter);

app.listen(3000)

