export const environment = {
  production: true,
  contextRoot: 'api-prod',
  port : process.env.PORT,
  jwt_secret: 'my dog is called Lady',
  db: {
    host: process.env.DB_HOST,
    username:process.env.DB_USERNAME,
    password:process.env.DB_PASSWORD,
    port:process.env.DB_PORT,
    name:process.env.DB_NAME
  }
};
