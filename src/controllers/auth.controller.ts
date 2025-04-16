import { Request, Response } from 'express';
import bcrypt from 'bcryptjs'
import { handleError } from '../helpers/error.handler';
import { ResponseHandler } from '../helpers/response.handler';
import AuthModel, { IAuth } from '../models/auth.model'
import jwt, {JwtPayload} from 'jsonwebtoken'
import { AuthenticatedRequest } from '../middlewares/auth.middleware';



class AuthController{
  async RegisterUser(req:Request,res:Response):Promise<void>{
    try {
      const {email,password,full_name} = req.body
      if(!email || !password){
        ResponseHandler(res,400,false,{message:'Invalid parametres!'})
      }
      const existUser = await AuthModel.findOne({email})
      if(existUser){
        ResponseHandler(res,400,false,{message:"User already exist!"})
        return
      }
      const hash_pass = await bcrypt.hash(password,10)

      const user:IAuth = await AuthModel.create({
        email,
        password:hash_pass,
        full_name
      })
      const payload = {
        id:user._id,
        email:user.email,
      }
      const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:"15m"})
      const refreshToken = jwt.sign(payload,process.env.JWT_SECRET_KEY!, {expiresIn:"7d"})
      res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:'strict',
        maxAge: 7*24*60*60*1000
      })
      
      ResponseHandler(res,200,true,{user,accessToken,refreshToken})
    } catch (error) {
      handleError(res,500,'Internal server error!',error)
    }
  }
  async LoginUser(req:Request,res:Response):Promise<void>{
    try {
      const {email, password} = req.body
      if(!email || !password){
        ResponseHandler(res,400,false,{message:"Invalid parametres!"})
        return
      }
      const user = await AuthModel.findOne({email})
      if(!user){
        ResponseHandler(res,400,false,{message:"User not found!"})
        return
      }
      
      const is_pass = await bcrypt.compare(password,user.password)
      if(!is_pass){
        ResponseHandler(res,400,false,{message:"Invalid parametres!"})
        return
      }

      const payload = {
        id:user._id,
        email:user.email,
      }
      const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:"15m"})
      const refreshToken = jwt.sign(payload,process.env.JWT_SECRET_KEY!, {expiresIn:"7d"})
      res.cookie("refreshToken",refreshToken,{
        httpOnly:true,
        secure:false,
        sameSite:'strict',
        maxAge: 7*24*60*60*1000
      })
      ResponseHandler(res,200,true,{user,accessToken,refreshToken})
    } catch (error) {
      handleError(res,500,'Internal server error!',error)
    }
  }
  async RefreshToken(req:AuthenticatedRequest,res:Response):Promise<void>{
    try {
      const authHeader = req.headers['authorization']
      const refreshToken = authHeader && authHeader.split(' ')[1]
      if(!refreshToken){
        ResponseHandler(res,400,false,{message:"Refresh token is not provided!"})
        return
      }
      jwt.verify(refreshToken,process.env.JWT_SECRET_KEY!,async(err,data)=>{
        if(err){
          ResponseHandler(res,401,false,{message:"Refresh token expired!"})
          return
        }
        const payload = data as JwtPayload;
        const accessToken = jwt.sign(payload,process.env.JWT_SECRET_KEY!,{expiresIn:"15m"})
        const user = await AuthModel.findById(payload.id)

        ResponseHandler(res,200,true,{user,accessToken,refreshToken})
      })
    } catch (error) {
      handleError(res,500,'Internal server error!',error)
    }
  }



  async ProtectedRoute(req:AuthenticatedRequest,res:Response):Promise<void>{
    try {
      ResponseHandler(res,200,true,{user:req.user})
    } catch (error) {
      handleError(res,500,'Internal server error!',error)
    }
  }
}

export default new AuthController()