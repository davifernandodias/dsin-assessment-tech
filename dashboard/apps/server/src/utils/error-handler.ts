import { Response } from "express";


class ErrorHandler {
  public async handle(error: Error, res: Response){
    console.error({
      message: error.message ?? "An unexpected error occurred",
      error
    });

    if(error instanceof Error) {
      const err = error as Error  & { statusCode?: number };
      res.status(err.statusCode ?? 500).json({ message: err.message });
      return;
    }
    res.status(500).json({ message: "An unexpected error occurred" });
  }
}

export const errorHandler = new ErrorHandler();