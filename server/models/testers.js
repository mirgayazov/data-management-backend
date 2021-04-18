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
    db.any('insert into testers(full_name, test_method, work_experience, position, telephone_number, passport_details) values($1, $2, $3, $4, $5, $6)', [tester.fullName, tester.testMethod, Number(tester.workExperience), tester.position, tester.telephoneNumber, tester.passportDetails])
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

export default { getTesters, findTesterByID, createTester, deleteTester }