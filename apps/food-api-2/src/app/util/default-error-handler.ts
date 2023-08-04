import { NextFunction, Request, Response } from "express";
import { logger } from "../util/logger";
export function defaultErrorHandler(
  err: Error ,
  request: Request,
  response: Response,
  next: NextFunction
) {
  if (response.headersSent) {
    logger.error("Delegating to builtin express error handler ", err);
    return next(err);
  }
  response.status(500).json({
    status: "error",
    message: "Default error handler trigger",
    err : {
      message: err.message
    },
  });
}
