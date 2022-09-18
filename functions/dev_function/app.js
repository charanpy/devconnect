const express = require('express');
const catalyst = require('zcatalyst-sdk-node');

const app = express();

app.use(express.json());

app.use((req, res, next) => {
  const initializeCatalyst = catalyst.initialize(req);
  req.catalyst = initializeCatalyst;
  next();
});

const errorController = require('./controllers/error.controller');
const authRoutes = require('./routers/auth.route');

app.use('/api/v1/auth', authRoutes);

app.use(errorController);

module.exports = app;
