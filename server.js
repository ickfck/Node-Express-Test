var express = require('express');
var app = express();
const mysqlConnection = require('./mysqlConnector.js');
const path = require('node:path'); 

const recordController = require('./Controllers/articlesController');

app.use(express.json())
app.use(express.urlencoded( {extended: true} ))
app.use(express.static('Public'))


app.get("/", recordController.getAllArticles)

app.set('view engine', 'ejs')

//Routes
const singleRouter = require('./Routes/single_routes')
const usersRouter = require('./Routes/users')
const articlesRouter = require('./Routes/articles')
const adminRouter = require('./Routes/admin.js')
const { password } = require('./mysqlConnector');

//Router Scopes
app.use('/', singleRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/articles', articlesRouter);

app.listen(3000)