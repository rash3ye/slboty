import { NextFunction, Request, Response } from "express";

const verifyToken = async (_req: Request, res: Response, next: NextFunction): Promise<any> => {
  // check header or url parameters or post parameters for token
  // const token: string = req.headers.authorization.split(' ')[1];

  

  try {
    // verifies secret and checks exp
    // req.email = decoded.email;
    next();
  } catch (err) {
    res.status(500).send({ auth: false, message: err });
  }
};

export default verifyToken;
