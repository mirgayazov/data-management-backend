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

const getTesterProjects = (email, callback) => {
    return new Promise((resolve, reject) => {
        db.one('select personnel_number from testers where email=$1', email)
            .then(data => {
                let pn = data.personnel_number
                db.any('select order_id from order_tester where tester_personnel_number=$1', Number(pn
                ))
                    .then(data => {
                        let orderIds = data.map(el => Number(el.order_id))
                        let queryText = 'select * from orders where id in '
                        let myIn = `( ${orderIds.join(',')} )`
                        queryText += myIn
                        db.any(queryText)
                            .then(orders => {
                                db.tx(t => {
                                    let qs = new Array(orders.length)
                                    for (let j = 0; j < orders.length; j++) {
                                        const order = orders[j];
                                        qs[j] = t.any('select * from stages where order_id=$1', order.id)
                                    }
                                    return t.batch(qs);
                                })
                                    .then(data => {
                                        let newOrders = []
                                        for (let i = 0; i < orders.length; i++) {
                                            const order = orders[i];
                                            order.stages = data[i];
                                            newOrders.push(order)
                                        }
                                        resolve(newOrders)
                                    })
                                    .catch(error => {
                                        reject(error)
                                    });
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
    // return new Promise((resolve, reject) => {
    //     db.one('select personnel_number from testers where email=$1', email)
    //         .then(data => {
    //             let pn = data.personnel_number
    //             // console.log(Number(pn))
    //             db.any('select order_id from order_tester where tester_personnel_number=$1', Number(pn
    //             ))
    //                 .then(data => {
    //                     let orderIds = data.map(el => Number(el.order_id))
    //                     // console.log(orderIds)
    //                     let queryText = 'select orders.*, stages.curator, stages.report, stages.adoption_date, stages.closing_date from orders left join stages on orders.id = stages.order_id where orders.id in '
    //                     // let queryText2 = 'select * from stages where order_id in '
    //                     let myIn = `( ${orderIds.join(',')} )`
    //                     queryText += myIn
    //                     // queryText2 += myIn
    //                     db.any(queryText)
    //                         .then(orders => {
    //                             let newArr = []
    //                             for (const order of orders) {
    //                                 if (order.curator !== null) {
    //                                     let schema = {
    //                                         orderId: order.id,
    //                                         stage: {
    //                                             curator: order.curator,
    //                                             report: order.report,
    //                                             adoption_date: order.adoption_date,
    //                                             closing_date: order.closing_date,
    //                                         }
    //                                     }
    //                                     newArr.push(schema)
    //                                 }
    //                             }
    //                             console.log(orders)
    //                             // for (const item of newArr) {
    //                             //     let 
    //                             // }
    //                             // console.log(newArr)
    //                             // let newOrders = []
    //                             // for (const order of orders) {
    //                             //     db.any('select * from stages where order_id=$1', order.id)
    //                             //         .then(data => {
    //                             //             let newOrder = order
    //                             //             newOrder.stages = data
    //                             //             newOrders.push(newOrder)
    //                             //         })
    //                             // }
    //                             // console.log(newOrders)
    //                             // resolve(newOrders)
    //                         })
    //                         .catch(err => {
    //                             reject(err)
    //                         })
    //                 })
    //                 .catch(err => {
    //                     callback(err, null);
    //                 });
    //         })
    //         .catch(err => {
    //             callback(err, null);
    //         });
    // }).then(orders => {
    //     callback(null, orders)
    // }).catch(err => {
    //     console.log(err)
    // })
};

const saveStage = (schema, callback) => {
    db.one('select count(id) from stages where order_id=$1', schema.order_id)
        .then(data => {
            if (Number(data.count) === 0) {
                let adoption_date = schema.closing_date
                db.any('insert into stages (adoption_date, curator, closing_date, report, order_id) values   ($1, $2, $3, $4, $5)', [adoption_date, schema.curator, schema.closing_date, schema.report, schema.order_id])
                    .then(data => {
                        callback(null, data);
                    })
                    .catch(err => {
                        callback(err, null);
                    });
            } else {
                db.any('select id from stages where order_id=$1', schema.order_id)
                    .then(data => {
                        let maxId = Math.max.apply(null, (data.map(item => Number(item.id))))
                        db.one('select closing_date from stages where id=$1', maxId)
                            .then(data => {
                                let newAdoptionDate = data.closing_date
                                db.any('insert into stages (adoption_date, curator, closing_date, report, order_id) values   ($1, $2, $3, $4, $5)', [newAdoptionDate, schema.curator, schema.closing_date, schema.report, schema.order_id])
                                    .then(data => {
                                        callback(null, data);
                                    })
                                    .catch(err => {
                                        callback(err, null);
                                    });
                            })
                    })
            }
        })

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

export default { getTesters, findTesterByID, createTester, deleteTester, updateTester, getTesterProjects, saveStage }