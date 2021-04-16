const Orders = require('../models/orders');

exports.getOrders = (req, res) => {
    Orders.getOrders((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'orders': data });
        }
    });
};
