import db from '../server.js';

const getOrders = (callback) => {
    db.tx(t => {
        return t.batch([t.any('select * from orders'), t.any('select order_id, developer_personnel_number from order_developer'), t.any('select order_id, tester_personnel_number from order_tester'), t.any('select personnel_number, full_name, position from developers'), t.any('select personnel_number, full_name, position from testers')])
    }).then(res => {
        let orders = res[0]
        let developers_links = res[1]
        let testers_links = res[2]
        let Developers = res[3]
        let Testers = res[4]
        let _neworders = []
        for (const order of orders) {
            let developers = []
            let testers = []
            while (true) {
                let indx = developers_links.findIndex(dev_link => dev_link.order_id === order.id)
                if (indx === -1) break
                else {
                    let dev = Developers.filter(developer => developer.personnel_number === developers_links[indx].developer_personnel_number)
                    if (dev[0]) {
                        developers.push({ id: dev[0].personnel_number, name: dev[0].full_name, position: dev[0].position })
                    }
                    developers_links[indx].order_id = null
                }
            }
            while (true) {
                let indx = testers_links.findIndex(tes_link => tes_link.order_id === order.id)
                if (indx === -1) break
                else {
                    let tes = Testers.filter(tester => tester.personnel_number === testers_links[indx].tester_personnel_number)
                    if (tes[0]) {
                        testers.push({ id: tes[0].personnel_number, name: tes[0].full_name, position: tes[0].position })
                    }
                    testers_links[indx].order_id = null
                }
            }
            _neworders.push({ ...order, developers: developers, testers: testers })
        }
        return _neworders
    }).then(orders => {
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
                callback(null, newOrders)
            })
            .catch(err => {
                callback(err, null)
            });
    }).catch(err => {
        callback(err, null)
    });
};

const createOrder = (order, callback) => {
    db.any('insert into orders(name, customer_id, cost, technical_task, customer_feedback, order_type) values($1, $2, $3, $4, $5, $6)', [order.name, Number(order.customerId), Number(order.cost), order.technicalTask, order.customerFeedback, order.orderType])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const getStages = (orderId, callback) => {
    db.any('select * from stages where order_id=$1', orderId)
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const updateOrder = (order, callback) => {
    db.any('update orders set name=$1, customer_id=$2, cost=$3, technical_task=$4, customer_feedback=$5, order_type=$6 where id=$7', [order.name, Number(order.customerId), Number(order.cost), order.technicalTask, order.customerFeedback, order.orderType, Number(order.id)])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const deleteOrder = (id, callback) => {
    db.any('delete from orders where id=$1', Number(id))
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

//schema = {orderId: any, designatedDevelopers: Array()}
const appointDeveloper = (schema, callback) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < schema.designatedDevelopers.length; i++) {
            db.any('select count(id) from order_developer where developer_personnel_number=$1 and order_id=$2', [Number(schema.designatedDevelopers[i]), Number(schema.orderId)])
                .then(res => {
                    let count = res[0].count
                    if (count <= 0) {
                        db.any('insert into order_developer(developer_personnel_number, order_id) values($1, $2)', [Number(schema.designatedDevelopers[i]), Number(schema.orderId)])
                    }
                    if (i === schema.designatedDevelopers.length - 1) {
                        resolve(true)
                    }
                })
        }
    }).then(data => {
        callback(null, data);
    }).catch(err => {
        callback(err, null);
    });
};

//schema = {orderId: any, designatedTesters: Array()}
const appointTester = (schema, callback) => {
    return new Promise((resolve, reject) => {
        for (let i = 0; i < schema.designatedTesters.length; i++) {
            db.any('select count(id) from order_tester where tester_personnel_number=$1 and order_id=$2', [Number(schema.designatedTesters[i]), Number(schema.orderId)])
                .then(res => {
                    let count = res[0].count
                    if (count <= 0) {
                        db.any('insert into order_tester(tester_personnel_number, order_id) values($1, $2)', [Number(schema.designatedTesters[i]), Number(schema.orderId)])
                    }
                    if (i === schema.designatedTesters.length - 1) {
                        resolve(true)
                    }
                })
        }
    }).then(data => {
        callback(null, data);
    }).catch(err => {
        callback(err, null);
    });
};

//schema = {orderId: any, developerId: any}
const removeDeveloperFromOrder = (schema, callback) => {
    db.any('delete from order_developer where developer_personnel_number=$1 and order_id=$2', [Number(schema.developerId), Number(schema.orderId)])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

//schema = {orderId: any, testerId: any}
const removeTesterFromOrder = (schema, callback) => {
    db.any('delete from order_tester where tester_personnel_number=$1 and order_id=$2', [Number(schema.testerId), Number(schema.orderId)])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getOrders, createOrder, deleteOrder, updateOrder, appointDeveloper, removeDeveloperFromOrder, appointTester, removeTesterFromOrder, getStages }
