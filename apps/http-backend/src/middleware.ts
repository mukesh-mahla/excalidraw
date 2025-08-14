import { NextFunction, Request, Response } from "express";
import  Jwt  from "jsonwebtoken";
import { JWT_SECERET } from "@repo/backend-common/config";


export function userAuth(req:Request,res:Response,next:NextFunction){
    const token = req.headers["authorization"] ?? ""

    const decoded = Jwt.verify(token,JWT_SECERET)
    if(decoded){
        //@ts-ignore
       req.userId = decoded.id
       next()
    }
    else{
        res.status(403).json({msg:"unautharized"})
    }
}