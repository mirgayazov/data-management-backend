const Testers = require('../models/testers');

exports.getTesters = (req, res) => {
    Testers.getTesters((err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json({ 'testers': data });
        }
    });
};

exports.findTesterByID = (req, res) => {
    Testers.findTesterByID(req.params.id, (err, data) => {
        if (err) {
            console.log(err);
            return res.sendStatus(500);
        } else {
            res.json(data);
        }
    });
};