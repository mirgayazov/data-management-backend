import { getTesters, findTesterByID } from './controllers/testers.js';
import { getOrders } from './controllers/orders.js';
import express, { json, urlencoded } from 'express';
import _pgp from 'pg-promise'

const pgp =  _pgp();
const pg = pgp('postgres://kamil:1809@localhost:5432/websiteDevelopment');
const PORT = 3001
const app = express()

app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3000");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers"
    );
    next();
});

app.get('/testers', getTesters);
app.get('/testers/:id', findTesterByID);
app.get('/orders', getOrders);

pg.connect()
    .then((obj) => {
        console.log(`Congratulations: database connected successfully!`);
        obj.done();
    })
    .then(() => {
        app.listen(PORT, () => {
            console.log(`API server started at: http://localhost:${PORT}`)
        })
    })
    .catch(err => {
        console.log(`App crashed: database connection problem: `, err.message);
    });

export default pg