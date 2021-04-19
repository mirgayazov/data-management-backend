import testers from '../models/testers.js';

export const getTesters = (req, res) => {
    testers.getTesters((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'testers': data });
        }
    });
};

export const findTesterByID = (req, res) => {
    testers.findTesterByID(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json(data);
        }
    });
};

export const createTester = (req, res) => {
    testers.createTester(req.body.tester, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Создан тестировщик:', req.body.tester);
            res.sendStatus(200);
        }
    });
};

export const deleteTester = (req, res) => {
    testers.deleteTester(req.body.pn, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Тестировщик с персональным номером', req.body.pn, 'был усешно удален...');
            res.sendStatus(200);
        }
    });
};