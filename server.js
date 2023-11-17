const logger = require('morgan');
const http = require('http');
const dotenv = require('dotenv');

process.on('uncaughtException', (err) => {
  console.log('UNCAUGHT EXCEPTION! SERVER IS SHUTTING DOWN');
  console.log(err.name, err.message);
  process.exit(1);
});

dotenv.config({ path: './config.env' });

const app = require('./app');
const { appConfig } = require('./config');
const { constants } = require('./constants');

const server = http.createServer(app);

const runningEnvironment = appConfig.NODE_ENV;

if (runningEnvironment === constants.RUNNING_ENVIRONMENTS.DEVELOPMENT) {
  app.use(logger('dev'));
}

const PORT = appConfig.PORT;

const appServer = server.listen(PORT, () => {
  console.log(`Server is running on ${runningEnvironment} mode on Port: ${PORT} `);
});

process.on('unhandledRejection', (err) => {
  console.log('UNHANDLED REJECTION! SERVER IS SHUTTING DOWN');
  console.log(err.name, err.message);
  appServer.close(() => {
    process.exit(1);
  });
});
