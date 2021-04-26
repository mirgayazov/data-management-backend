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

export default { login }
