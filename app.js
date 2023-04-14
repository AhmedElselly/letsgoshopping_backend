require('dotenv').config();

const express = require('express');
const app = express();
const mongoose = require('mongoose');
const helmet = require('helmet');
const morgan = require('morgan');
const cookieParser = require('cookie-parser');
const expressValidator = require('express-validator');
const cors = require('cors');
const PORT = process.env.PORT || 8000;

const authRouter = require('./routes/auth');
const usersRouter = require('./routes/users');
const categoryRouter = require('./routes/category');
const productsRouter = require('./routes/products');
const braintreeRouter = require('./routes/braintree');
const orderRouter = require('./routes/order');

mongoose.connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useCreateIndex: true
}).then(() => console.log('DB Connected!'));

app.use(express.json());
app.use(helmet());
app.use(morgan('dev'));
app.use(cookieParser());
app.use(cors());
app.use(expressValidator());


app.use('/api', authRouter);
app.use('/api', usersRouter);
app.use('/api', categoryRouter);
app.use('/api', productsRouter);
app.use('/api', braintreeRouter);
app.use('/api', orderRouter);

// RUN: npm start
app.listen(PORT, function(){
    console.log(`Server is on port ${PORT}`);
});