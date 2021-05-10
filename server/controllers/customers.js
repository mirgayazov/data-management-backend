import customers from '../models/customers.js';

export const getCustomers = (req, res) => {
    customers.getCustomers((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'customers': data });
        }
    });
};

export const getCustomerProjects = (req, res) => {
    let email = req.body.data.email
    customers.getCustomerProjects(email, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json(data);
        }
    });
};

export const createCustomer = (req, res) => {
    customers.createCustomer(req.body.customer, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Создан клиент:', req.body.customer);
            res.sendStatus(200);
        }
    });
};

export const updateCustomer = (req, res) => {
    customers.updateCustomer(req.body.customer, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Обновлен заказчик:', req.body.customer);
            res.sendStatus(200);
        }
    });
};

export const deleteCustomer = (req, res) => {
    customers.deleteCustomer(req.body.id, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Клиент с номером', req.body.id, 'был успешно удален...');
            res.sendStatus(200);
        }
    });
};