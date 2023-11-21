const jwt = require('jsonwebtoken');
const { appConfig } = require('../config');

exports.generateJWT = (id) => {
  return jwt.sign({ id }, appConfig.JWT_SECRET, {
    expiresIn: appConfig.JWT_EXPIRES_IN,
  });
};
