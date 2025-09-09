"use client"
import AuthPage from "@/component/authPage";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";

export default function Signup(){
    return <AuthPage isSignin={false} onSumbit={async({userName,email,password})=>{
        const res = await axios.post(`${HTTP_BACKEND}/signup`,{
            userName,
            email,
            Password:password
        })
    }}
     />
}