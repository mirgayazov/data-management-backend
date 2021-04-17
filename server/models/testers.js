import db from '../server.js';

const getTesters = (callback) => {
    db.any('select * from testers')
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const findTesterByID = (id, callback) => {
    db.any('select * from testers where personnel_number=$1', id)
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};


const createTester = (tester, callback) => {
    db.any('insert into testers(personnel_number, full_name, test_method, work_experience, position, telephone_number, passport_details) values($1, $2, $3, $4, $5, $6, $7)', [Date.now, tester.fullName, '', 5, '', '', ''])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getTesters, findTesterByID, createTester }

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