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
import { createMeal } from "./app/routes/meals/create-meal";
import { updateMeal } from "./app/routes/meals/update-meal";
import { searchMealsByCategory } from "./app/routes/meals/fetch-meals-by-category";
import { deactivateMeal } from "./app/routes/meals/deactivate-meal";
import { createTopping } from "./app/routes/toppings/create-topping";
import { updateTopping } from "./app/routes/toppings/update-topping";
import { deactivateTopping } from "./app/routes/toppings/deactivate-topping";
import { fetchToppings } from "./app/routes/toppings/fetch-toppings";
import { fetchToppingsByMealId } from "./app/routes/meal-topping/fetch-toppings-by-mealId";
import { assignToppingToMeal } from "./app/routes/meal-topping/assign-topping-to-meal";
import { removeToppingFromMeal } from "./app/routes/meal-topping/remove-topping-from-meal";
import { placeOrder } from "./app/routes/ordering/place-order";
import { fetchOrders } from "./app/routes/ordering/fetch-orders";
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

  app.route('/api/meals').post(createMeal)
  app.route('/api/meals/:mealId').patch(updateMeal)
  app.route('/api/meals/search').get(searchMealsByCategory)
  app.route('/api/meals/:mealId').delete(deactivateMeal)

  app.route('/api/toppings').post(createTopping)
  app.route('/api/toppings').get(fetchToppings)
  app.route('/api/toppings/:toppingId').patch(updateTopping)
  app.route('/api/toppings/:toppingId').delete(deactivateTopping)

  app.route('/api/meal-toppings/search').get(fetchToppingsByMealId)
  app.route('/api/meal-toppings/assign').post(assignToppingToMeal)
  app.route('/api/meal-toppings/remove').post(removeToppingFromMeal)

  app.route('/api/orders/place').post(placeOrder)
  app.route('/api/orders/search').get(fetchOrders)



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
