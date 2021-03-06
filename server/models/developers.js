import db from '../server.js';
import bcrypt from 'bcrypt'

const getDevelopers = (callback) => {
    db.any('select * from developers')
        .then(developers => {
            db.tx(t => {
                let qs = new Array(developers.length)
                for (let j = 0; j < developers.length; j++) {
                    const developer = developers[j];
                    qs[j] = t.any('select count(id) from order_developer where developer_personnel_number=$1', developer.personnel_number)
                }
                return t.batch(qs);
            })
                .then(data => {
                    let newdevelopers = []
                    for (let i = 0; i < developers.length; i++) {
                        const developer = developers[i];
                        developer.projectsCount = Number(data[i][0].count);
                        newdevelopers.push(developer)
                    }
                    callback(null, newdevelopers)
                })
                .catch(err => {
                    callback(err, null)
                });
            // callback(null, data);
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

const getDeveloperProjects = (email, callback) => {
    return new Promise((resolve, reject) => {
        db.one('select personnel_number from developers where email=$1', email)
            .then(data => {
                let pn = data.personnel_number
                db.any('select order_id from order_developer where developer_personnel_number=$1', Number(pn
                ))
                    .then(data => {
                        let orderIds = data.map(el => Number(el.order_id))
                        let queryText = 'select * from orders where id in '
                        let myIn = `( ${orderIds.join(',')} )`
                        queryText += myIn
                        db.any(queryText)
                            .then(orders => {
                                resolve(orders)
                            })
                            .catch(err => {
                                reject(err)
                            })
                    })
                    .catch(err => {
                        callback(err, null);
                    });
            })
            .catch(err => {
                callback(err, null);
            });
    }).then(orders => {
        callback(null, orders)
    }).catch(err => {
        console.log(err)
    })
};

export default { getDevelopers, createDeveloper, deleteDeveloper, updateDeveloper, getDeveloperProjects }