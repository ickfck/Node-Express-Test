var express = require('express');
var bcrypt = require('bcrypt');
var bodyParser = require('body-parser');

var app = express();
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(ignoreFavicon);

const recordController = require('./Controllers/articlesController');
app.use(express.static('Public'))

app.get("/", recordController.getAllArticles)

app.set('view engine', 'ejs')

//Routes
const indexRouter = require('./Routes/index_routes')
const usersRouter = require('./Routes/users')
const articlesRouter = require('./Routes/articles')
const adminRouter = require('./Routes/admin.js')

//Router Scopes
app.use('/', indexRouter);
app.use('/admin', adminRouter);
app.use('/users', usersRouter);
app.use('/login', usersRouter);
app.use('/articles', articlesRouter);

function ignoreFavicon(req, res, next) {
    if (req.originalUrl.includes('favicon.ico')) {
      res.status(204).end()
    }
    next();
  }

app.listen(3000)

