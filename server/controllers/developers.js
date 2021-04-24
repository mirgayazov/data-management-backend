import developers from '../models/developers.js';

export const getDevelopers = (req, res) => {
    developers.getDevelopers((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'developers': data });
        }
    });
};

export const createDeveloper = (req, res) => {
    developers.createDeveloper(req.body.developer, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Создан программист:', req.body.developer);
            res.sendStatus(200);
        }
    });
};

export const updateDeveloper = (req, res) => {
    developers.updateDeveloper(req.body.developer, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Обновлен разработчик:', req.body.developer);
            res.sendStatus(200);
        }
    });
};

export const deleteDeveloper = (req, res) => {
    developers.deleteDeveloper(req.body.pn, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            console.log('Программист с персональным номером', req.body.pn, 'был успешно удален...');
            res.sendStatus(200);
        }
    });
};