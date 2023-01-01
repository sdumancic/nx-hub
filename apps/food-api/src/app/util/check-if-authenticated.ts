import {NextFunction, Request, Response} from "express";
import {logger} from "../util/logger";
import jwt = require("jsonwebtoken")
import { environment } from "../../environments/environment";
const JWT_SECRET = environment.jwt_secret

export function checkIfAuthenticated(  request: Request, response: Response, next: NextFunction){
  const authJwtToken = request.headers.authorization;
  if (!authJwtToken){
    logger.info('JWT was not present, access denied')
    response.sendStatus(403)
    return;
  }

  checkJwtValidity(authJwtToken)
    .then( user => {
      logger.info('Successfully decoded JWT token ', user)
       response.setHeader('is-admin', user.isAdmin.toString());

      logger.info('ok')
      const headers = response.getHeaders();
      logger.info(JSON.stringify(headers));

      next();
    })
    .catch(error => {
      logger.error('Access denied', error)
      response.sendStatus(403);
    })

}

async function checkJwtValidity(authJwtToken: string){
  const token = authJwtToken.split(' ')[1];
  const user = await jwt.verify(token, JWT_SECRET)
  logger.info('Found user details ', user)
  return user;
}
