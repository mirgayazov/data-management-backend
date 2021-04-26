import db from '../server.js';
import bcrypt from 'bcrypt'

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
    const passport = {
        series: developer.passportSeries,
        number: developer.passportNumber,
    }
    db.any('insert into developers(full_name, work_experience, position, telephone_number, passport_details, salary, email) values($1, $2, $3, $4, $5, $6, $7)', [developer.fullName, Number(developer.workExperience), developer.position, developer.telephoneNumber, passport, Number(developer.salary), developer.email])
        .then(data => {
            let password = developer.passportSeries + developer.passportNumber
            bcrypt.hash(password, 10, (err, hash) => {
                db.any('insert into users(login, password, position) values($1, $2, $3)', [developer.email, hash, 'developer']).then(data => {
                    callback(null, data);
                })
            })
        })
        .catch(err => {
            callback(err, null);
        });
};

const updateDeveloper = (developer, callback) => {
    const passport = {
        series: developer.passportSeries,
        number: developer.passportNumber,
    }
    db.any('update developers set full_name=$1, work_experience=$2, position=$3, telephone_number=$4, passport_details=$5, salary=$6, email=$7 where personnel_number=$8', [developer.fullName, Number(developer.workExperience), developer.position, developer.telephoneNumber, passport, Number(developer.salary), developer.email, developer.personnel_number])
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

export default { getDevelopers, createDeveloper, deleteDeveloper, updateDeveloper }