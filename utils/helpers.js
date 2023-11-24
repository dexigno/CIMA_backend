const { appConfig } = require('../config');
const crypto = require('crypto');

exports.generateRandomString = (length) => {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let randomString = '';

  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    randomString += characters.charAt(randomIndex);
  }

  return randomString;
};

exports.encrypt = (text) => {
  const cipher = crypto.createCipher('aes-256-cbc', appConfig.CIPHER_SECRET_KEY);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return encrypted;
};
exports.decrypt = (encryptedText) => {
  const decipher = crypto.createDecipher('aes-256-cbc', appConfig.CIPHER_SECRET_KEY);
  let decrypted = decipher.update(encryptedText, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};
