import { NextFunction, Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { MealEntity } from "../../entities/meal";
export async function uploadMealImage(
  request: Request,
  response: Response,
  next: NextFunction
) {
  try {
    const mealId = request.params.mealId
    const file = request['file'];
    console.log('xxx ' + file.filename)
    if (!file) {
      return response.status(400).send('Image must be provided in request');
    }

    await AppDataSource
      .createQueryBuilder()
      .update(MealEntity)
      .set({imageUrl:file.filename})
      .where("id = :mealId", {mealId})
      .execute()
    response.status(200).send(file)
  } catch (err) {
    response.status(500).send(err)
  }
}
