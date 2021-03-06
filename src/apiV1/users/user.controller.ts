import { Request, Response } from 'express';
import User from './user.model';

export default class UserController {
  public create = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await new User();
      user.name = req.body.name || "";
      user.lastName = req.body.lastName || "";
      user.email = req.body.email || "";
      user.password = req.body.password || "";
      user.save()

      res.status(200).send({
        success: true,
        data: user
      });
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };
  
  public findAll = async (_req: Request, res: Response): Promise<any> => {
    try {
      const users = await User.find();
      if (!users) {
        return res.status(404).send({
          success: false,
          message: 'Users not found',
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: users
      });
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public findOne = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await User.findById(req.params.id, { password: 0 });
      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }

      res.status(200).send({
        success: true,
        data: user
      });
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public update = async (req: Request, res: Response): Promise<any> => {
    const { name, lastName, email, password } = req.body;
    try {
      const userUpdated = await User.findByIdAndUpdate(
        req.params.id,
        {
          $set: {
            name,
            lastName,
            email,
            password
          }
        },
        { new: true }
      );
      if (!userUpdated) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      res.status(200).send({
        success: true,
        data: userUpdated
      });
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };

  public remove = async (req: Request, res: Response): Promise<any> => {
    try {
      const user = await User.findByIdAndRemove(req.params.id);

      if (!user) {
        return res.status(404).send({
          success: false,
          message: 'User not found',
          data: null
        });
      }
      res.status(204).send();
    } catch (err: any) {
      res.status(500).send({
        success: false,
        message: err.toString(),
        data: null
      });
    }
  };
}
