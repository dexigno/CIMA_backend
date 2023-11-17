const express = require('express');
const cors = require('cors');
const helmet = require('helmet');

const routes = require('./routes');
const { DB } = require('./database');
const ErrorHandler = require('./utils/ErrorHandler');
const GlobalError = require('./middleware/GlobalError');

const app = express();

DB();

app.use(helmet());

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
  cors({
    methods: 'GET,POST,PUT,PATCH,DELETE',
    origin: '*',
    credentials: true,
  }),
);

app.use('/api/v1', routes);

app.get('/', (req, res) => {
  res.json({ status: 'ok', message: 'Server running' });
});

app.all('*', (req, res, next) => {
  next(new ErrorHandler(`Cant't find route for ${req.originalUrl} this url.`, 404));
});

app.use(GlobalError);

module.exports = app;
