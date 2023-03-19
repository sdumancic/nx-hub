import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { Like, Raw } from "typeorm";
import { CustomerEntity } from "../../entities/customer";

export async function searchCustomers(
  request: Request,
  response: Response,
  next: NextFunction
) {

  try {
    const searchTerm = request.query.term;

    const list = await AppDataSource.getRepository(CustomerEntity)
      .find({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          city: true,
          address: true,
          customerLocation: true,
          createdAt: false,
          modifiedAt: false,
        },
        where: [
          {firstName: Raw(alias => `LOWER(${alias}) Like '%${searchTerm.toString().toLowerCase()}%'`) },
          {lastName: Raw(alias => `LOWER(${alias}) Like '%${searchTerm.toString().toLowerCase()}%'`) },
          {address: Raw(alias => `LOWER(${alias}) Like '%${searchTerm.toString().toLowerCase()}%'`) },
          ],
        skip: 0,
        take: 100
      });


    response.status(200).json(list);
  } catch (error) {
    logger.error(error);
    return next(error);
  }

}
