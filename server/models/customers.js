import db from '../server.js';

const getCustomers = (callback) => {
    db.tx(t => {
        return t.batch([t.any('select * from customers'), t.any('select id, name, customer_id from orders')])
    }).then(res => {
        let customers = res[0]
        let orders = res[1]
        let _customers = []
        for (const customer of customers) {
            let _orders = []
            while (true) {
                let indx = orders.findIndex(order => order.customer_id === customer.id)
                if (indx === -1) break
                else {
                    _orders.push({ id: orders[indx].id, name: orders[indx].name })
                    orders[indx].customer_id = null
                }
            }
            _customers.push({ ...customer, orders: _orders })
        }
        return _customers
    }).then(customers => {
        callback(null, customers)
    }).catch(err => {
        callback(err, null)
    });
};

const createCustomer = (customer, callback) => {
    const passport = {
        series: customer.passportSeries,
        number: customer.passportNumber,
    }
    db.any('insert into customers(full_name, address, email, telephone_number, remarks_to_customer, passport_details) values($1, $2, $3, $4, $5, $6)', [customer.fullName, customer.address, customer.email, customer.telephoneNumber, customer.remarksToCustomer, passport])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const updateCustomer = (customer, callback) => {
    const passport = {
        series: customer.passportSeries,
        number: customer.passportNumber,
    }
    db.any('update customers set full_name=$1, address=$2, email=$3, telephone_number=$4, remarks_to_customer=$5, passport_details=$6 where id=$7', [customer.fullName, customer.address, customer.email, customer.telephoneNumber, customer.remarksToCustomer, passport, customer.id])
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

const deleteCustomer = (id, callback) => {
    db.any('delete from customers where id=$1', Number(id))
        .then(data => {
            callback(null, data);
        })
        .catch(err => {
            callback(err, null);
        });
};

export default { getCustomers, createCustomer, deleteCustomer, updateCustomer }