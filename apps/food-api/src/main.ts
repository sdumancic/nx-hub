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
import { loginUser } from "./app/routes/auth/login";
import { checkIfAuthenticated } from "./app/util/check-if-authenticated";
import { checkIfAdmin } from "./app/util/check-if-admin";
import { listOfRoutes } from "./app/routes/listOfRoutes";
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
import * as swaggerUi from 'swagger-ui-express';
import * as swaggerDocument from './swagger.json'
import { fetchAllMeals } from "./app/routes/meals/fetch-all-meals";
import { createCustomer } from "./app/routes/customer/create-customer";
import { fetchAllCustomers } from "./app/routes/customer/fetch-all-customers";
import { updateCustomer } from "./app/routes/customer/update-customer";
import { updateOrder } from "./app/routes/ordering/update-order";
import { searchCustomers } from "./app/routes/customer/search-customers";
import { cancelOrder } from "./app/routes/ordering/cancel-order";

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

  app.use('/swagger', swaggerUi.serve, swaggerUi.setup(swaggerDocument, { explorer: true }));


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

  app.route(`${contextRoot}/`).get(listOfRoutes)
  app.route(`${contextRoot}/db-info`).get(dbInfo)
  app.route(`${contextRoot}/categories`).get(fetchAllCategories)
  app.route(`${contextRoot}/categories`).post(checkIfAuthenticated, checkIfAdmin,createCategory)
  app.route(`${contextRoot}/categories/search`).get(searchCategoryByName)
  app.route(`${contextRoot}/categories/:id`).get(fetchCategoryById)


  app.route(`${contextRoot}/meals`).get(fetchAllMeals)
  app.route(`${contextRoot}/meals`).post(checkIfAuthenticated, checkIfAdmin,createMeal)
  app.route(`${contextRoot}/meals/:mealId`).patch(checkIfAuthenticated, checkIfAdmin,updateMeal)
  app.route(`${contextRoot}/meals/search`).get(searchMealsByCategory)
  app.route(`${contextRoot}/meals/:mealId`).get(findOneMeal)
  app.route(`${contextRoot}/meals/:mealId`).delete(checkIfAuthenticated, checkIfAdmin,deactivateMeal)

  app.post(`${contextRoot}/meals/:mealId/image-upload`, uploadOptions.single('productImage'), uploadMealImage)

  app.route(`${contextRoot}/toppings`).post(checkIfAuthenticated, checkIfAdmin,createTopping)
  app.route(`${contextRoot}/toppings`).get(fetchToppings)
  app.route(`${contextRoot}/toppings/:toppingId`).patch(checkIfAuthenticated, checkIfAdmin,updateTopping)
  app.route(`${contextRoot}/toppings/:toppingId`).delete(checkIfAuthenticated, checkIfAdmin,deactivateTopping)

  app.route(`${contextRoot}/meal-toppings/search`).get(fetchToppingsByMealId)
  app.route(`${contextRoot}/meal-toppings/assign`).post(checkIfAuthenticated, checkIfAdmin,assignToppingToMeal)
  app.route(`${contextRoot}/meal-toppings/remove`).post(checkIfAuthenticated, checkIfAdmin,removeToppingFromMeal)

  app.route(`${contextRoot}/orders/place`).post(placeOrder)

  app.route(`${contextRoot}/orders/search`).get(checkIfAuthenticated,fetchOrders)
  app.route(`${contextRoot}/orders/:orderId`).get(findOneOrder)
  app.route(`${contextRoot}/orders/:orderId`).patch(checkIfAuthenticated,updateOrder)
  app.route(`${contextRoot}/orders/:orderId/dispatch`).post(checkIfAuthenticated,dispatchOrder)
  app.route(`${contextRoot}/orders/:orderId/complete`).post(checkIfAuthenticated,completeOrder)
  app.route(`${contextRoot}/orders/:orderId/cancel`).post(checkIfAuthenticated,cancelOrder)

  app.route(`${contextRoot}/users`).post(createUser)
  app.route(`${contextRoot}/users/searchByEmail`).get(findOneUserByEmail)
  app.route(`${contextRoot}/users/:userId/change-password`).patch(changePassword)
  app.route(`${contextRoot}/users/:userId`).get(findOneUser)
  app.route(`${contextRoot}/users/:userId`).patch(checkIfAuthenticated, checkIfAdmin,updateUser)
  app.route(`${contextRoot}/users`).get(fetchAllUsers)

  app.route(`${contextRoot}/roles`).post(checkIfAuthenticated, checkIfAdmin,createRole)
  app.route(`${contextRoot}/roles`).get(fetchAllRoles)
  app.route(`${contextRoot}/roles/:roleId`).patch(checkIfAuthenticated, checkIfAdmin,updateRole)
  app.route(`${contextRoot}/roles/:roleId`).delete(checkIfAuthenticated, checkIfAdmin,deactivateRole)

  app.route(`${contextRoot}/permissions`).post(checkIfAuthenticated, checkIfAdmin,createPermission)
  app.route(`${contextRoot}/permissions/search`).get(searchPermissions)
  app.route(`${contextRoot}/permissions/:permissionId`).patch(checkIfAuthenticated, checkIfAdmin,updatePermission)
  app.route(`${contextRoot}/permissions/:permissionId`).delete(checkIfAuthenticated, checkIfAdmin,deactivatePermission)

  app.route(`${contextRoot}/roles/:roleId/permissions/:permissionId`).post(checkIfAuthenticated, checkIfAdmin,assignPermissionToRole)
  app.route(`${contextRoot}/roles/:roleId/permissions/:permissionId`).delete(checkIfAuthenticated, checkIfAdmin,revokePermissionFromRole)

  app.route(`${contextRoot}/users/:userId/roles/:roleId`).post(checkIfAuthenticated, checkIfAdmin,assignRoleToUser)
  app.route(`${contextRoot}/users/:userId/roles/:roleId`).delete(checkIfAuthenticated, checkIfAdmin,revokeRoleFromUser)

  app.route(`${contextRoot}/login`).post(loginUser)

  app.route(`${contextRoot}/customers`).post(createCustomer)
  app.route(`${contextRoot}/customers`).get(fetchAllCustomers)
  app.route(`${contextRoot}/customers/search`).get(searchCustomers)
  app.route(`${contextRoot}/customers/:customerId`).patch(updateCustomer)


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
