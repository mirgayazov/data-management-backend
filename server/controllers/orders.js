import orders from '../models/orders.js';

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

export const createOrder = (req, res) => {
    orders.createOrder(req.body.order, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Создан заказ:', req.body.order);
            res.sendStatus(200);
        }
    });
};

export const updateOrder = (req, res) => {
    orders.updateOrder(req.body.order, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Обновлен заказ:', req.body.order);
            res.sendStatus(200);
        }
    });
};

export const deleteOrder = (req, res) => {
    orders.deleteOrder(req.body.id, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Заказ с номером', req.body.id, 'был успешно удален...');
            res.sendStatus(200);
        }
    });
};
