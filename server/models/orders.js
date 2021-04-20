import db from '../server.js';

const getOrders = (callback) => {
    db.any('select * from orders')
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
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

const deleteOrder = (id, callback) => {
    db.any('delete from orders where id=$1', Number(id))
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getOrders, createOrder, deleteOrder }
