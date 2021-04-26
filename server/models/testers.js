import db from '../server.js';
import bcrypt from 'bcrypt'

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
    const passport = {
        series: tester.passportSeries,
        number: tester.passportNumber,
    }
    db.any('insert into testers(full_name, test_method, work_experience, position, telephone_number, passport_details, salary, email) values($1, $2, $3, $4, $5, $6, $7, $8)', [tester.fullName, tester.testMethod, Number(tester.workExperience), tester.position, tester.telephoneNumber, passport, Number(tester.salary), tester.email])
        .then(data => {
            let password = tester.passportSeries + tester.passportNumber
            bcrypt.hash(password, 10, (err, hash) => {
                db.any('insert into users(login, password, position) values($1, $2, $3)', [tester.email, hash, 'tester']).then(data => {
                    callback(null, data);
                })
            })
        })
        .catch(err => {
            callback(err, null);
        });
};

const updateTester = (tester, callback) => {
    const passport = {
        series: tester.passportSeries,
        number: tester.passportNumber,
    }
    db.any('update testers set full_name=$1, test_method=$2, work_experience=$3, position=$4, telephone_number=$5, passport_details=$6, salary=$7, email=$8 where personnel_number=$9', [tester.fullName, tester.testMethod, Number(tester.workExperience), tester.position, tester.telephoneNumber, passport, Number(tester.salary), tester.email, tester.personnel_number])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};


const deleteTester = (pn, callback) => {
    db.any('delete from testers where personnel_number=$1', Number(pn))
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getTesters, findTesterByID, createTester, deleteTester, updateTester }