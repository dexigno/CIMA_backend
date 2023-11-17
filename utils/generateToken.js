const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');

exports.generateToken = (id) => {
  return jwt.sign({ id }, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRES_IN,
  });
};
