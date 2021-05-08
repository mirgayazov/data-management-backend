import { getTesters, findTesterByID, createTester, deleteTester, updateTester, getTesterProjects, saveStage } from './controllers/testers.js';
import { createOrder, deleteOrder, getOrders, updateOrder, appointDeveloper, removeDeveloperFromOrder, appointTester, removeTesterFromOrder, getStages } from './controllers/orders.js';
import { createDeveloper, getDevelopers, deleteDeveloper, updateDeveloper } from './controllers/developers.js';
import { createCustomer, deleteCustomer, getCustomers, updateCustomer } from './controllers/customers.js';
import express, { json, urlencoded } from 'express';
import pgPromise from 'pg-promise';
import { login, resetPassword, setPassword, changePassword, createStaff } from './controllers/auth.js';

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

app.get('/auth/set-password', setPassword)
app.post('/auth/login', login);
app.post('/auth/reset-password', resetPassword);
app.post('/auth/change-password', changePassword);
app.post('/auth/create-staff', createStaff);

app.get('/testers/:id', findTesterByID);
app.get('/testers', getTesters);
app.post('/testers', createTester);
app.delete('/testers', deleteTester);
app.put('/testers', updateTester);
app.post('/tester/projects', getTesterProjects);

app.post('/stages', saveStage);

app.get('/customers', getCustomers);
app.post('/customers', createCustomer);
app.delete('/customers', deleteCustomer);
app.put('/customers', updateCustomer);

app.get('/developers', getDevelopers);
app.post('/developers', createDeveloper);
app.delete('/developers', deleteDeveloper);
app.put('/developers', updateDeveloper);

app.get('/orders', getOrders);
app.post('/order/stages', getStages);
app.post('/orders', createOrder);
app.post('/orders/appoint-developer', appointDeveloper);
app.post('/orders/appoint-tester', appointTester);
app.post('/orders/remove-developer-from-order', removeDeveloperFromOrder);
app.post('/orders/remove-tester-from-order', removeTesterFromOrder);
app.delete('/orders', deleteOrder);
app.put('/orders', updateOrder);

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

// let fill = () => {
//     for (let i = 0; i < 200; i++) {
//         db.any('insert into order_developer(developer_personnel_number, order_id) values($1, $2)', [936 + i, 234 + i])
//             .then(data => {
//                 console.log('+')
//             })
//             .catch(err => {
//                 console.log(err)

//             });
//     }
// }

// fill()


