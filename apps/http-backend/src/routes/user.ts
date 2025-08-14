import { Router } from "express";
import bcrypt from "bcrypt"
const userRouter = Router()
import jwt from "jsonwebtoken"
import  {JWT_SECERET}  from "@repo/backend-common/config";
import { userAuth } from "../middleware";
import {CreateUserSchema,CreateSigninSchema} from "@repo/common/types"
import {prisma} from "@repo/db/client"

userRouter.post("/signup",async(req,res)=>{
    const result = CreateUserSchema.safeParse(req.body)
    if(result.error){
        return res.json({msg:"wrong credential"})
    }
    const {userName,email,Password} = result.data
    if(!userName || !email || !Password){
        return res.json({msg:"incomplete credential"})
    }
    const hashPassword = await bcrypt.hash(Password,10)
  
   await prisma.user.create({
        data:{
            userName,
            email,
            Password:hashPassword
        }
    })

    return res.json({msg:"signed up succesfully"})

})

userRouter.post("/signin",async(req,res)=>{
    const result = CreateSigninSchema.safeParse(req.body)
    if(result.error){
        return res.json({msg:"wrong creddential"})
    }
    const {email,Password} = result.data
    if( !email || !Password){
        return res.json({msg:"incomplete credential"})
    }
      const user =await prisma.user.findUnique({
        where:{email}
    })

      if(!user){return res.json({msg:"user not found"})}

     const password = await bcrypt.compare(Password,user.Password)
      if(password){
             const token = jwt.sign({id:user.id},JWT_SECERET)
             return res.json({msg:"signed in succesfully",token:token})
        }
        else{
            res.json({msg:"wrong credential"})
        }

})

userRouter.post("/room",userAuth,(req,res)=>{
res.json({roomId:123})
})
