const { query } = require('express');
const { use } = require('../Routes/index_routes');
const mysqlConnection = require('../mysqlConnector');


exports.postRegisterUser = async (request, response) => {
    response.render('register')

}

exports.loginUser = (request, response) => {
    response.render('articles')
}

exports.getAllUsers = (request, response) => {
    mysqlConnection.query('SELECT * FROM users', (err, rows) => {
        if (err) {
            console.log(err);
        } else {
            response.render('users', { data: rows }); 
            console.log('Edit User');
            console.log(rows);
        }
    });
}
exports.deleteUser = async (request, response) => {
    const user_id = request.params.id;

    try {
        // Delete the user
        await new Promise((resolve, reject) => {
            mysqlConnection.query('DELETE FROM users WHERE user_id=?', [user_id], (err, result) => {
                if (err) {
                    reject(err);
                } else {
                    console.log('User deleted');
                    resolve();
                }
            });
        });

        // Select all users after the deletion
        mysqlConnection.query('SELECT * FROM users', (err, result) => {
            if (err) {
                console.log(err);
                response.status(500).send('Error fetching users');
            } else {
                const usersData = result;
                // Render the 'user_deleted' template with the updated user data
                response.render('admin_users', { data: usersData });
            }
        });
    } catch (error) {
        console.log(error);
        response.status(500).send('Error deleting user');
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

    /*
             const user_name = body.params.user_name;
    const user_email = body.params.user_email;
    const salt = await bcrypt.genSalt()
    const hashPassword = await bcrypt.hash(req.body.user_password, salt)        
    const user = {name : req.body.user_name, password: completePassword}
    const query = "INSERT INTO users (user_name, user_password, user_create_date, user_email) VALUES (?, ?, current_Date(), user_email)"
    const registerQuery = await mysqlConnection(query, [user_name, hashPassword, user_email] )
    console.log(hashPassword)        
    console.log(salt) 
    */