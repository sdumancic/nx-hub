import * as dotenv from "dotenv";
import "reflect-metadata";
import * as express from 'express';
import * as path from 'path';
const result = dotenv.config();
import { AppDataSource } from "./app/routes/data-source";
import { logger } from "./app/util/logger";
import {isInteger} from './app/util/helper';

import cors = require('cors')
import bodyParser = require("body-parser")
import multer = require('multer')
import fs = require('fs');

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
import { dispatchOrder } from "./app/routes/ordering/dispatch-order";
import { completeOrder } from "./app/routes/ordering/complete-order";
import { uploadMealImage } from "./app/routes/meals/upload-meal-image";
import { findOneMeal } from "./app/routes/meals/find-one-meal";
import { findOneOrder } from "./app/routes/ordering/find-one-order";
const FILE_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const isValid = FILE_TYPE_MAP[file.mimetype];
    let uploadError = new Error('Invalid image type');
    if (isValid) {
      uploadError = null;
    }
   cb(uploadError, __dirname + '\\public\\uploads');

  },
  filename: function (req, file, cb) {
    const fileName = file.originalname.replace(' ', '-').split('.')[0];

    const extension = FILE_TYPE_MAP[file.mimetype];
    cb(null, `${fileName}.${extension}`);
  }
});
const uploadOptions = multer({ storage: storage });
const app = express();

if(result.error){
  console.log('error loading environment variables, aborting')
  process.exit(1)
}

function setupExpress() {
  app.use(express.json());
  app.use(cors({origin:true}))
  app.use(bodyParser.json())
  app.use('/assets', express.static(path.join(__dirname, 'assets')));
  app.use('/public-uploads', express.static(path.join(__dirname + '/public/uploads')));

  if (!fs.existsSync(path.join(__dirname + '/public/uploads'))){
    fs.mkdirSync(path.join(__dirname + '/public/uploads'), { recursive: true });
  }

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
  app.route('/api/meals/:mealId').get(findOneMeal)
  app.route('/api/meals/:mealId').delete(deactivateMeal)

  app.post('/api/meals/:mealId/image-upload', uploadOptions.single('productImage'), uploadMealImage)

  app.route('/api/toppings').post(createTopping)
  app.route('/api/toppings').get(fetchToppings)
  app.route('/api/toppings/:toppingId').patch(updateTopping)
  app.route('/api/toppings/:toppingId').delete(deactivateTopping)

  app.route('/api/meal-toppings/search').get(fetchToppingsByMealId)
  app.route('/api/meal-toppings/assign').post(assignToppingToMeal)
  app.route('/api/meal-toppings/remove').post(removeToppingFromMeal)

  app.route('/api/orders/place').post(placeOrder)
  app.route('/api/orders/search').get(fetchOrders)
  app.route('/api/orders/:orderId').get(findOneOrder)
  app.route('/api/orders/:orderId/dispatch').post(dispatchOrder)
  app.route('/api/orders/:orderId/complete').post(completeOrder)


}

function startServer(){
  logger.info('process.env.PORT -->' + process.env.PORT);
  logger.info('process.env.DB_HOST -->' + process.env.DB_HOST);
  logger.info('process.env.DB_PORT -->' + process.env.DB_PORT);
  logger.info('process.env.DB_NAME -->' + process.env.DB_NAME);
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
    logger.info('process.env.PORT -->' + process.env.PORT);
    logger.info('process.env.DB_HOST -->' + process.env.DB_HOST);
    logger.info('process.env.DB_PORT -->' + process.env.DB_PORT);
    logger.info('process.env.DB_NAME -->' + process.env.DB_NAME);
    logger.error('Error during datasource initialization ',err)
    process.exit(1)
  })
