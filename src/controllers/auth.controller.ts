import { Request, Response } from 'express';
import { handleError } from '../helpers/error.handler';
import { ResponseHandler } from '../helpers/response.handler';
import AuthModel from '../models/auth.model'

class AuthController{
  async RegisterUser(req:Request,res:Response):Promise<void>{
    try {
      const {email,password,full_name} = req.body
      const existUser = await AuthModel.findOne({email})
      if(existUser){
        ResponseHandler(res,400,{message:"User already exist!"})
        return
      }

      const user = await AuthModel


      const data = {}
      ResponseHandler(res,200,data)
    } catch (error) {
      handleError(res,500,'Internal server error!',error)
    }
  }
}