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
