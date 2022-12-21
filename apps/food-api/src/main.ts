import * as dotenv from "dotenv";
import "reflect-metadata";
import * as express from 'express';
import * as path from 'path';
import { AppDataSource } from "./app/routes/data-source";
import { logger } from "./app/util/logger";
import {isInteger} from './app/util/helper';

import cors = require('cors')
import bodyParser = require("body-parser")
import { dbInfo } from "./app/routes/info";
import { fetchAllCategories } from "./app/routes/category/fetch-all-categories";
import { createCategory } from "./app/routes/category/create-category";
import { searchCategoryByName } from "./app/routes/category/./search-category-by-name";
import { fetchCategoryById } from "./app/routes/category/fetch-category-by-id";
const app = express();

function setupExpress() {
  app.use(express.json());
  app.use(cors({origin:true}))
  app.use(bodyParser.json())
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  app.get('/api', (req, res) => {
    res.send({ message: 'Welcome to food-api!' });
  });
  app.route("/api/db-info").get(dbInfo)
  app.route('/api/categories').get(fetchAllCategories)
  app.route('/api/categories').post(createCategory)
  app.route('/api/categories/search').get(searchCategoryByName)
  app.route('/api/categories/:id').get(fetchCategoryById)


}

function startServer(){
  let port: number|undefined;
  const portEnv = process.env.PORT,
        portArg = process.argv[2]

  if (portEnv && isInteger(portEnv)){
    port = parseInt(portEnv)
  } else if (portArg && isInteger(portArg)){
    port = parseInt(portArg)
  } else {
    port = 9000
  }


  const server = app.listen(port, () => {
    logger.info(`HTTP Rest api server is running on http://localhost:${port}/api`)
  })
  server.on('error', console.error);
}

AppDataSource.initialize()
  .then( () => {
    logger.info('The datasource has been initialized')
    setupExpress()
    logger.info('Express has been initialized')
    startServer()
  })
  .catch(err => {
    logger.error('Error during datasource initialization ',err)
    process.exit(1)
  })
