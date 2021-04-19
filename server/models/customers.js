import db from '../server.js';

const getCustomers= (callback) => {
    db.any('select * from customers')
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getCustomers, }




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