import auth from '../models/auth.js';

export const login = (req, res) => {
    console.log(req.body.data)
    let { email, password } = req.body.data
    auth.login(email, password, (err, data) => {
        if (err) {
            console.log(err);
            res.json({ 'schema': data });
        } else {
            res.json({ 'schema': data });
        }
    });
};