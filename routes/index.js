const express = require('express');
const router = express.Router();

const authRoutes = require('./auth');

const routes = [{ path: '/auth', route: authRoutes }];

routes.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
