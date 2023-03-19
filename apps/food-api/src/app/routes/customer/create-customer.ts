import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { CustomerEntity } from "../../entities/customer";

export async function createCustomer(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const {firstName, lastName, city, address, customerLocation} = request.body;
    if (!address) {
      throw {message:'address is mandatory'};
    }

    const repository = AppDataSource.getRepository(CustomerEntity);
    const newCustomer = repository.create({ firstName, lastName, city, address, customerLocation});
    await AppDataSource.manager.save(newCustomer);
    response.status(201).json(newCustomer);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
