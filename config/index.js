exports.appConfig = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: Number(process.env.PORT) || 8000,
  MONGO_URI: process.env.MONGO_URI,
  LOCAL_MONGO_URI: process.env.LOCAL_MONGO_URI,
  JWT_SECRET: process.env.JWT_SECRET,
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};
