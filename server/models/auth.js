import db from '../server.js';
import bcrypt from 'bcrypt'

const login = (email, password, callback) => {
    db.one('select position, id, password as hash from users where login=$1', email)
        .then(res => {
            if (res.hash) {
                bcrypt.compare(password, res.hash, (err, result) => {
                    if (result === true) {
                        db.one(`select full_name from ${res.position}s where email=$1`, email)
                            .then(name => {
                                let schema = {
                                    resultCode: 0,
                                    id: res.id,
                                    name
                                }
                                callback(null, schema)
                            })
                            .catch(err => {
                                let schema = {
                                    resultCode: -1,
                                }
                                callback(null, schema)
                            })
                    } else {
                        let schema = {
                            resultCode: -1,
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

export default { login, setPassword }
