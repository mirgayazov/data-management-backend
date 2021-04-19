import db from '../server.js';

const getDevelopers = (callback) => {
    db.any('select * from developers')
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const createDeveloper = (developer, callback) => {
    const passportValues = developer.passportDetails.split(' ')
    const passport = {
        series: passportValues[0],
        number: passportValues[1],
    }
    db.any('insert into developers(full_name, work_experience, position, telephone_number, passport_details, salary) values($1, $2, $3, $4, $5, $6)', [developer.fullName, Number(developer.workExperience), developer.position, developer.telephoneNumber, passport, Number(developer.salary)])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const deleteDeveloper = (pn, callback) => {
    db.any('delete from developers where personnel_number=$1', Number(pn))
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getDevelopers, createDeveloper, deleteDeveloper}




// exports.findOrderByID = (id, callback) => {
//     db.any('select * from developers where personnel_number=$1', id)
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