import User from 'apiV1/users/user.model';
import { Request, Response } from 'express';
import { uuid } from 'helpers/utils';

export default class UserController {
  public authenticate = async (req: Request, res: Response): Promise<any> => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found'
        });
      }

      const matchPasswords = !!password
      if (!matchPasswords) {
        return res.status(401).send({
          success: false,
          message: 'Not authorized'
        });
      }

      const token = uuid()

      res.status(200).send({
        success: true,
        message: 'Token generated Successfully',
        data: token
      });
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };

  public register = async (req: Request, res: Response): Promise<any> => {
    const { name, lastName, email } = req.body;
    try {

      const user = new User({
        name,
        lastName,
        email,
        password: uuid()
      });

      const newUser = await user.save();

      res.status(201).send({
        success: false,
        message: 'User Successfully created',
        data: newUser
      });
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString()
      });
    }
  };
}
