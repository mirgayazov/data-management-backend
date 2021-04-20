import { getTesters, findTesterByID, createTester, deleteTester } from './controllers/testers.js';
import { getOrders } from './controllers/orders.js';
import { createDeveloper, getDevelopers, deleteDeveloper } from './controllers/developers.js';
import { createCustomer, deleteCustomer, getCustomers } from './controllers/customers.js';
import express, { json, urlencoded } from 'express';
import pgPromise from 'pg-promise';

const pgp = pgPromise({/* Init Options */ });
const db = pgp('postgres://kamil:1809@localhost:5432/websiteDevelopment');
const port = 3011;
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers"
    );
    next();
});

app.get('/testers', getTesters);
app.post('/testers', createTester);
app.delete('/testers', deleteTester);

app.get('/customers', getCustomers);
app.post('/customers', createCustomer);
app.delete('/customers', deleteCustomer);

app.get('/developers', getDevelopers);
app.post('/developers', createDeveloper);
app.delete('/developers', deleteDeveloper);


app.get('/testers/:id', findTesterByID);
app.get('/orders', getOrders);

db.connect()
    .then((obj) => {
        console.log(`Congratulations: database connected successfully!`);
        obj.done();
    })
    .then(() => {
        app.listen(port, () => {
            console.log(`API server started at: http://localhost:${port}`)
        })
    })
    .catch(err => {
        console.log(`App crashed: database connection problem: `, err.message);
    });

export default db
