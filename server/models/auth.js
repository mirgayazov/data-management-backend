import db from '../server.js';
import bcrypt from 'bcrypt'

const login = (email, password, callback) => {
    db.one('select position, id, password as hash from users where login=$1', email)
        .then(res => {
            if (res.hash) {
                bcrypt.compare(password, res.hash, (err, result) => {
                    if (result === true) {
                        if (res.position === 'manager' || res.position === 'admin') {
                            db.one(`select login from users where login=$1`, email)
                                .then(name => {
                                    let schema = {
                                        resultCode: 0,
                                        id: res.id,
                                        name,
                                        position: res.position,
                                    }
                                    callback(null, schema)
                                })
                                .catch(err => {
                                    let schema = {
                                        resultCode: -1,
                                        msg: 'query error'
                                    }
                                    callback(null, schema)
                                })
                        } else {
                            db.one(`select full_name from ${res.position}s where email=$1`, email)
                                .then(name => {
                                    let schema = {
                                        resultCode: 0,
                                        id: res.id,
                                        name,
                                        position: res.position,
                                    }
                                    callback(null, schema)
                                })
                                .catch(err => {
                                    let schema = {
                                        resultCode: -1,
                                        msg: err
                                    }
                                    callback(null, schema)
                                })
                        }
                    } else {
                        let schema = {
                            resultCode: -1,
                            msg: 'compare failed'
                        }
                        callback(null, schema)
                    }
                })
            } else {
                let schema = {
                    resultCode: -1,
                }
                callback(null, schema)
            }
        })
        .catch(err => {
            let schema = {
                resultCode: -1,
            }
            callback(null, schema)
        });
};

const setPassword = (email, newPassword, callback) => {
    bcrypt.hash(newPassword, 10, (err, hash) => {
        db.any('update users set password=$1 where login=$2', [hash, email])
            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err, null);
            });
    })
};

const createStaff = (email, newPassword, position, callback) => {
    bcrypt.hash(newPassword, 10, (err, hash) => {
        db.any('insert into users(login, password, position) values($1,$2,$3)', [email, hash, position])
            .then(data => {
                callback(null, data);
            })
            .catch(err => {
                callback(err, null);
            });
    })
};

export default { login, setPassword, createStaff }
