const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');
const userRoutes = require('./user');
const patientRoutes = require('./patient');

const routes = [
  { path: '/auth', route: authRoutes },
  { path: '/user', route: userRoutes },
  { path: '/patient', route: patientRoutes },
];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
