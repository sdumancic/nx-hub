export const environment = {
  production: false,
  contextRoot: 'api',
  port : process.env.PORT,
  db: {
    host: process.env.DB_HOST,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    name:process.env.DB_NAME
  }
};
