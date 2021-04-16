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
