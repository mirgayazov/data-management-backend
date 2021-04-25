import db from '../server.js';

const getOrders = (callback) => {
    db.tx(t => {
        return t.batch([t.any('select * from orders'), t.any('select order_id, developer_personnel_number from order_developer'), t.any('select order_id, tester_personnel_number from order_tester'), t.any('select personnel_number, full_name from developers'), t.any('select personnel_number, full_name from testers')])
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
                    developers.push({ id: dev[0].personnel_number, name: dev[0].full_name })
                    developers_links[indx].order_id = null
                }
            }
            while (true) {
                let indx = testers_links.findIndex(tes_link => tes_link.order_id === order.id)
                if (indx === -1) break
                else {
                    let tes = Testers.filter(tester => tester.personnel_number === testers_links[indx].tester_personnel_number)
                    testers.push({ id: tes[0].personnel_number, name: tes[0].full_name })
                    testers_links[indx].order_id = null
                }
            }
            _neworders.push({ ...order, developers: developers, testers: testers })
        }
        return _neworders
    }).then(orders => {
        callback(null, orders)
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

const updateOrder = (order, callback) => {
    db.any('update orders set name=$1, customer_id=$2, cost=$3, technical_task=$4, customer_feedback=$5, order_type=$6 where id=$7', [order.name, Number(order.customerId), Number(order.cost), order.technicalTask, order.customerFeedback, order.orderType, order.id])
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
    db.tx(t => {
        for (const pn of schema.designatedDevelopers) {
            t.any('insert into order_developer(developer_personnel_number, order_id) values($1, $2)', [Number(pn), Number(schema.orderId)])
        }
        return t.batch([true]);
    }).then(data => {
        callback(null, data);
    }).catch(err => {
        callback(err, null);
    });
    // for (const pn of schema.designatedDevelopers) {
    //     db.any('insert into order_developer(developer_personnel_number, order_id) values($1, $2)', [Number(pn), Number(schema.orderId)])
    //         .then(data => {
    //             callback(null, data);
    //         })
    //         .catch(err => {
    //             callback(err, null);
    //         });
    // }
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

export default { getOrders, createOrder, deleteOrder, updateOrder, appointDeveloper, removeDeveloperFromOrder }
