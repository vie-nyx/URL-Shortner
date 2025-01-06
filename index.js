const express = require('express');
const urlRoute = require('./routes/url');
const cookieParser = require('cookie-parser');
const staticRouter = require('./routes/staticRouter');
const userRoute = require('./routes/user');
const {checkForAuthetication,restrictTo} = require('./middlewares/auth')
const path = require('path');
const { connectToMongoDB } = require('./connection');
const URL = require('./models/url');

const app = express();
const PORT = 8001;

connectToMongoDB('mongodb://localhost:27017/shorturl');

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware for parsing data
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(checkForAuthetication);
// Route handlers
app.use('/', staticRouter);
app.use('/url',restrictTo(['NORMAL','ADMIN']),urlRoute);
app.use('/user', userRoute);
app.use('/:id([a-zA-Z0-9]+)', urlRoute); // Restrict ':id' to alphanumeric strings

// Error-handling middleware
app.use((err, req, res, next) => {
    console.error('Error occurred:', err.stack);
    res.status(500).send('Something went wrong!');
});

app.listen(PORT, () => console.log(`Server started at PORT:${PORT}`));
