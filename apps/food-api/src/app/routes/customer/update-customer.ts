import { NextFunction, Request, Response } from "express";
import { logger } from "../../util/logger";
import { AppDataSource } from "../data-source";
import { CustomerEntity } from "../../entities/customer";
export async function updateCustomer(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const customerId = request.params.customerId;
    const {firstName, lastName, city, address, customerLocation} = request.body;
    const foundCustomer = await AppDataSource.getRepository(
      CustomerEntity
    ).findOneBy({
      id: Number(customerId),
    });
    if (!foundCustomer) {
      throw {message:'Customer not found'};
    }

    await AppDataSource
      .createQueryBuilder()
      .update(CustomerEntity)
      .set({
        firstName,
        lastName,
        city,
        address,
        customerLocation
      })
      .where("id = :customerId", {customerId})
      .execute()

    const updatedOCustomer = await AppDataSource.getRepository(CustomerEntity)
      .findOneByOrFail({
        id: Number(customerId)
      })

    response.status(201).json(updatedOCustomer);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
