import db from '../server.js';

const getCustomers = (callback) => {
    db.any('select * from customers')
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const createCustomer = (customer, callback) => {
    const passportValues = customer.passportDetails.split(' ');
    const passport = {
        series: passportValues[0],
        number: passportValues[1],
    };
    db.any('insert into customers(full_name, address, email, telephone_number, remarks_to_customer, passport_details) values($1, $2, $3, $4, $5, $6)', [customer.fullName, customer.address, customer.email, customer.telephoneNumber, customer.remarks, passport])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const deleteCustomer = (id, callback) => {
    db.any('delete from customers where id=$1', Number(id))
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getCustomers, createCustomer, deleteCustomer }




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