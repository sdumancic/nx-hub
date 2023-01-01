import { NextFunction, Request, Response } from 'express';
import { loginUser } from './auth/login';

export async function listOfRoutes(
  request: Request,
  response: Response,
  next: NextFunction
) {
  const responseJson = {
    message: 'Welcome to food-api!',
  };

  response.send(responseJson);
}
