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

export const saveStage = (req, res) => {
    testers.saveStage(req.body.data.schema, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            return res.sendStatus(200);
        }
    });
};

export const getTesterProjects = (req, res) => {
    let email = req.body.data.email;
    testers.getTesterProjects(email, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'orders': data });
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

export const updateTester = (req, res) => {
    testers.updateTester(req.body.tester, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Обновлен тестировщик:', req.body.tester);
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
            console.log('Тестировщик с персональным номером', req.body.pn, 'был успешно удален...');
            res.sendStatus(200);
        }
    });
};