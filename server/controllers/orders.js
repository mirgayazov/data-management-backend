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

export const getStages = (req, res) => {
    orders.getStages(req.body.data.orderId, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'stages': data });
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

export const appointDeveloper = (req, res) => {
    orders.appointDeveloper(req.body.schema, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Назначен(ы) разработчик(и) на заказ с номером', req.body.schema.orderId, '...');
            res.sendStatus(200);
        }
    });
};

export const appointTester = (req, res) => {
    orders.appointTester(req.body.schema, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Назначен(ы) тестировщики(и) на заказ с номером', req.body.schema.orderId, '...');
            res.sendStatus(200);
        }
    });
};

export const removeDeveloperFromOrder = (req, res) => {
    orders.removeDeveloperFromOrder(req.body.schema, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('С заказа с номером', req.body.schema.orderId, ' снят разрабочик с номером ', req.body.schema.developerId, '...');
            res.sendStatus(200);
        }
    });
};

export const removeTesterFromOrder = (req, res) => {
    orders.removeTesterFromOrder(req.body.schema, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('С заказа с номером', req.body.schema.orderId, ' снят тестировщик с номером ', req.body.schema.testerId, '...');
            res.sendStatus(200);
        }
    });
};