import orders from '../models/orders.js'

export const getOrders = (req, res) => {
    orders.getOrders((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'orders': data });
        }
    });
};
