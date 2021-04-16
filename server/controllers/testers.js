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