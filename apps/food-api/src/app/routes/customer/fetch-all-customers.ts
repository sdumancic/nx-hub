import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { logger } from "../../util/logger";
import { Like } from "typeorm";
import { CustomerEntity } from "../../entities/customer";

export async function fetchAllCustomers(
  request: Request,
  response: Response,
  next: NextFunction
) {

  try {

    const filters = request.query.filter;
    const page = request.query.page;
    const firstName = filters ? filters["firstName"] : null;
    const lastName = filters ? filters["lastName"] : null;
    const city = filters ? filters["city"] : null;
    const address = filters ? filters["address"] : null;
    const limit = page ? page["size"] : 10 || 10;
    const pageNumber = page ? page["number"] : 0 || 0;
    const offset = pageNumber * limit;
    const sort = request.query.sort;
    const order = {};
    if (sort) {
      const sortFields: string[] = sort.toString().split(",");
      for (let i = 0; i < sortFields.length; i++) {
        if (sortFields[i][0] === "-") {
          const actualField = sortFields[i].substring(1);
          order[actualField] = "DESC";
        } else {
          order[sortFields[i]] = "ASC";
        }
      }
    }

    const [list, count] = await AppDataSource.getRepository(CustomerEntity)
      .findAndCount({
        select: {
          id: true,
          firstName: true,
          lastName: true,
          city: true,
          address: true,
          customerLocation: {
            coordinates: true
          },
          createdAt: true,
          modifiedAt: true,
        },
        where: {
          firstName: firstName != null ? Like(`${firstName}%`) : Like("%"),
          lastName: lastName != null ? Like(`${lastName}%`) : Like("%"),
          city: city != null ? Like(`${city}%`) : Like("%"),
          address: address != null ? Like(`${address}%`) : Like("%")
        },
        order: order,
        skip: Number(offset),
        take: Number(limit)
      });


    response.status(200).json({
      list,
      count,
      limit,
      offset
    });
  } catch (error) {
    logger.error(error);
    return next(error);
  }

}
