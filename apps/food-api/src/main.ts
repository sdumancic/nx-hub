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
import { environment } from "./environments/environment";
import { createUser } from "./app/routes/auth/user/create-user";
import { fetchAllUsers } from "./app/routes/auth/user/fetch-all-users";
import { findOneUser } from "./app/routes/auth/user/find-one-user";
import { findOneUserByEmail } from "./app/routes/auth/user/find-one-user-by-email";
import { defaultErrorHandler } from "./app/util/default-error-handler";
import { changePassword } from "./app/routes/auth/user/change-password";
import { updateUser } from "./app/routes/auth/user/update-user";
import { createRole } from "./app/routes/auth/role/create-role";
import { fetchAllRoles } from "./app/routes/auth/role/fetch-all-roles";
import { updateRole } from "./app/routes/auth/role/update-role";
import { deactivateRole } from "./app/routes/auth/role/deactivate-role";
import { updatePermission } from "./app/routes/auth/permission/update-permission";
import { deactivatePermission } from "./app/routes/auth/permission/deactivate-permission";
import { searchPermissions } from "./app/routes/auth/permission/search-permissions";
import { createPermission } from "./app/routes/auth/permission/create-permission";
import { assignPermissionToRole } from "./app/routes/auth/role-permission/assign-permission-to-role";
import { revokePermissionFromRole } from "./app/routes/auth/role-permission/revoke-permission-from-role";
import { assignRoleToUser } from "./app/routes/auth/role/assign-role-to-user";
import { revokeRoleFromUser } from "./app/routes/auth/role/revoke-role-from-user";
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
  let contextRoot = environment.contextRoot;
  if(!contextRoot){
    console.log('contextRoot is not set')
    process.exit(1);
  }
  if (!contextRoot.startsWith('/')){
    contextRoot = '/' + contextRoot;
  }

  app.get(`${contextRoot}`, (req, res) => {
    res.send({ message: 'Welcome to food-api!' });
  });
  app.route(`${contextRoot}/db-info`).get(dbInfo)
  app.route(`${contextRoot}/categories`).get(fetchAllCategories)
  app.route(`${contextRoot}/categories`).post(createCategory)
  app.route(`${contextRoot}/categories/search`).get(searchCategoryByName)
  app.route(`${contextRoot}/categories/:id`).get(fetchCategoryById)

  app.route(`${contextRoot}/meals`).post(createMeal)
  app.route(`${contextRoot}/meals/:mealId`).patch(updateMeal)
  app.route(`${contextRoot}/meals/search`).get(searchMealsByCategory)
  app.route(`${contextRoot}/meals/:mealId`).get(findOneMeal)
  app.route(`${contextRoot}/meals/:mealId`).delete(deactivateMeal)

  app.post(`${contextRoot}/meals/:mealId/image-upload`, uploadOptions.single('productImage'), uploadMealImage)

  app.route(`${contextRoot}/toppings`).post(createTopping)
  app.route(`${contextRoot}/toppings`).get(fetchToppings)
  app.route(`${contextRoot}/toppings/:toppingId`).patch(updateTopping)
  app.route(`${contextRoot}/toppings/:toppingId`).delete(deactivateTopping)

  app.route(`${contextRoot}/meal-toppings/search`).get(fetchToppingsByMealId)
  app.route(`${contextRoot}/meal-toppings/assign`).post(assignToppingToMeal)
  app.route(`${contextRoot}/meal-toppings/remove`).post(removeToppingFromMeal)

  app.route(`${contextRoot}/orders/place`).post(placeOrder)
  app.route(`${contextRoot}/orders/search`).get(fetchOrders)
  app.route(`${contextRoot}/orders/:orderId`).get(findOneOrder)
  app.route(`${contextRoot}/orders/:orderId/dispatch`).post(dispatchOrder)
  app.route(`${contextRoot}/orders/:orderId/complete`).post(completeOrder)

  app.route(`${contextRoot}/users`).post(createUser)
  app.route(`${contextRoot}/users/searchByEmail`).get(findOneUserByEmail)
  app.route(`${contextRoot}/users/:userId/change-password`).patch(changePassword)
  app.route(`${contextRoot}/users/:userId`).get(findOneUser)
  app.route(`${contextRoot}/users/:userId`).patch(updateUser)
  app.route(`${contextRoot}/users`).get(fetchAllUsers)

  app.route(`${contextRoot}/roles`).post(createRole)
  app.route(`${contextRoot}/roles`).get(fetchAllRoles)
  app.route(`${contextRoot}/roles/:roleId`).patch(updateRole)
  app.route(`${contextRoot}/roles/:roleId`).delete(deactivateRole)

  app.route(`${contextRoot}/permissions`).post(createPermission)
  app.route(`${contextRoot}/permissions/search`).get(searchPermissions)
  app.route(`${contextRoot}/permissions/:permissionId`).patch(updatePermission)
  app.route(`${contextRoot}/permissions/:permissionId`).delete(deactivatePermission)

  app.route(`${contextRoot}/roles/:roleId/permissions/:permissionId`).post(assignPermissionToRole)
  app.route(`${contextRoot}/roles/:roleId/permissions/:permissionId`).delete(revokePermissionFromRole)

  app.route(`${contextRoot}/users/:userId/roles/:roleId`).post(assignRoleToUser)
  app.route(`${contextRoot}/users/:userId/roles/:roleId`).delete(revokeRoleFromUser)

  app.use(defaultErrorHandler);


}

function startServer(){

  logger.info('contextRoot: ' + environment.contextRoot);
  logger.info('port: ' + environment.port);
  logger.info('db.host: ' + environment.db.host);
  logger.info('db.name: ' + environment.db.name);
  logger.info('db.username: ' + environment.db.username);
  let port: number|undefined;
  const portEnv = environment.port,
        portArg = process.argv[2]

  if (portEnv && isInteger(portEnv)){
    port = parseInt(portEnv)
  } else if (portArg && isInteger(portArg)){
    port = parseInt(portArg)
  } else {
    port = 9000
  }

  const contextRoot = environment.contextRoot

  const server = app.listen(port, () => {
    logger.info(`HTTP Rest api server is running on http://localhost:${port}/${contextRoot}`)
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
