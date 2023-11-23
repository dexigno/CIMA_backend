const mongoose = require('mongoose');
const { RUNNING_ENVIRONMENTS } = require('../constants');
const { appConfig } = require('../config');

const DB_URI =
  appConfig.NODE_ENV === RUNNING_ENVIRONMENTS.PRODUCTION
    ? appConfig.MONGO_URI
    : appConfig.LOCAL_MONGO_URI;

exports.DB = async () => {
  try {
    const db = await mongoose.connect(DB_URI);
    console.log(`Connected to Database ${db.connections[0].host}`);
  } catch (error) {
    console.log('DB_CONNECECTION_ERROR', error);
    process.exit(1);
  }
};
