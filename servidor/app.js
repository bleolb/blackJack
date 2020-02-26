const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = process.env.PORT || 8080;
const rutas = require('./controllers/authController');



app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use('/server', rutas);


app.listen(port, () => {
    console.log(`Running on port ${port}`);
})