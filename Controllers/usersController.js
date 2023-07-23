const { use } = require('../Routes/single_routes');
const mysqlConnection = require('../mysqlConnector');

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