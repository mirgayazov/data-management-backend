var pgp = require('pg-promise')(/*options*/);
var db = pgp('postgres://kamil:1809@localhost:5432/websiteDevelopment');

exports.getOrders = (callback) => {
    db.any('select * from orders')
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

// exports.findOrderByID = (id, callback) => {
//     db.any('select * from testers where personnel_number=$1', id)
//         .then(data => {
//             callback(null, data);
//         })
//         .catch(err => {
//             callback(err, null);
//         });
// };

// exports.createUser = (user, callback) => {
//     client.query(
//         "insert into users(name) values($1)",
//         [user.name],
//         (err, results) => {
//             callback(err, results);
//         }
//     );
// };

// exports.updateUserName = (user, newName, callback) => {
//     client.query(
//         "update users set name=$1 where id=$2",
//         [newName, user.id],
//         (err, results) => {
//             callback(err, results);
//         }
//     );
// };

// exports.deleteUser = (user, callback) => {
//     client.query("delete from users where id=$1", [user.id], (err, results) => {
//         callback(err, results);
//     });
// };