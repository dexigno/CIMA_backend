const uuid = require('uuid');
exports.generateUniqueToken = () => {
  return uuid.v4();
};
