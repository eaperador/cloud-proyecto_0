const express = require('express');
const app = express();
const path = require('path');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const mongoose = require('mongoose');
const apiRouter = require('./routes/api');

app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public/dist')))

app.use('/api', apiRouter);

mongoose.connect('mongodb://localhost:27017/eventos', { });

app.listen(8080, () => {
    console.log("Server up on port 8080")
});