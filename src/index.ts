import express, { Request, Response } from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db'
import authRouter from './routes/auth.router'
import cookieParser from 'cookie-parser'

dotenv.config()
const app = express()
app.use(cookieParser())
app.use(express.json())
app.use(express.urlencoded({extended:true}))
connectDB()

//routes
app.use('/api/auth',authRouter)


const port = process.env.port || 5000
app.listen(port,()=>{
  console.log(`Server is running on port ${port}`)
})