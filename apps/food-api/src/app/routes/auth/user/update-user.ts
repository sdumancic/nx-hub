import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../../data-source";
import { logger } from "../../../util/logger";
import { UserEntity } from "../../../entities/user";
import crypto = require("crypto")
import { calculatePasswordHash } from "@hub/shared/util/core";
import { MealEntity } from "../../../entities/meal";

export async function updateUser(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const userId = request.params.userId
    const {email, firstName, lastName, address, city, state, pictureUrl}  = request.body;
    const repository = AppDataSource.getRepository(UserEntity);
    const user = await repository
      .createQueryBuilder("users")
      .where("id = :userId", { userId })
      .getOne();
    if (!user) {
      const message= {message:"User with given ID does not exist"};
      response
        .status(400)
        .json(message);
      return;
    }

    const changes = {}
    if (email){
      const existingUser = repository.findOneBy({email: email});
      if (existingUser){
        response
          .status(400)
          .json({message:'Email already registered'});
        return;
      }
      changes['email'] = email;
    }
    if (firstName){
      changes['firstName'] = firstName;
    }
    if (lastName){
      changes['lastName'] = lastName;
    }
    if (address){
      changes['address'] = address;
    }
    if (city){
      changes['city'] = city;
    }
    if (state){
      changes['state'] = state;
    }
    if (pictureUrl){
      changes['pictureUrl'] = pictureUrl;
    }

    await AppDataSource
      .createQueryBuilder()
      .update(UserEntity)
      .set(changes)
      .where("id = :userId", {userId})
      .execute()

    const updatedUser = await AppDataSource.getRepository(UserEntity)
      .findOneByOrFail({
        id: Number(userId)
      })

    response.status(201).json(updatedUser);
  } catch (error) {
    logger.error(error);
    return next(error);
  }
}
