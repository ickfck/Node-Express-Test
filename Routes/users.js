const express = require('express')
const router = express.Router()
const mysqlConnection = require('../mysqlConnector');


const userController = require('../Controllers/usersController')

router.use(logger)


router.get("/", userController.getAllUsers)
router.get("/delete_user/:id", userController.deleteUser)
router.get("/new_user", (request, response) => {
    response.render('new_user');
    console.log('New User Has Been Created')
}) 

router.get("/edit_user/:id", (request, response) => {
    const userId = request.params.id;
       
    mysqlConnection.query('SELECT * FROM users WHERE user_id=?', [userId], (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            response.render('admin_edit_user', { data: rows[0] });
            console.log(rows);
        }
    });
    
})

    router.get("/create_user", (request, response) => {
        const userId = request.params.id;
        mysqlConnection.query('SELECT * FROM users WHERE user_id=?', [userId], (err, rows) => {
            if (err) {
                console.log(err);
            } else {
                response.render('admin_create_user', { data: rows[0] }); 
                console.log('Edit User');
                console.log(rows);
            }
        });
});

router.post("/new_user", (request, response) => {
    const user_name = request.body.user_name;
    const user_password = request.body.user_password;
     
    mysqlConnection.query('INSERT INTO users (user_name, user_password, user_create_date) VALUES (?, ?, Current_Date())', [user_name, user_password], (err, result) => {
        if (err) {
            console.log(err)
        }
        response.render('user_created');
        console.log('User ' + user_name + 'Has Been Created')
    })
}
)

router.post("/update_user", (request, response) => {
    const user_id = request.body.user_id;
    const user_name = request.body.user_name;
    const user_password = request.body.user_password;
    const user_create_date = request.body.user_created_date        

    mysqlConnection.query('UPDATE users SET user_name = ?, user_password = ? WHERE user_id = ?', [user_name, user_password, user_id], (err, result) => {
        if (err) {
            console.log(err)
        }
        response.render('user_updated')
        console.log('User ' + user_name + ' Has Been Modified')
    })
    
}
)

function logger(request, response, next){
    console.log(request.originalUrl)
    next()
}

module.exports = router;