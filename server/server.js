const testersController = require('./controllers/testers');
const ordersController = require('./controllers/orders');
const express = require('express')
const PORT = 3003

const app = express()

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "http://localhost:3001");
    res.setHeader("Access-Control-Allow-Methods", "GET,POST,PUT,DELETE,OPTIONS");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Content-Type, Access-Control-Allow-Headers"
    );
    next();
});

app.get('/testers', testersController.getTesters);
app.get('/testers/:id', testersController.findTesterByID);

app.get('/orders', ordersController.getOrders);


app.listen(PORT, () => {
    console.log(`API server started at  http://localhost:${PORT}`)
})