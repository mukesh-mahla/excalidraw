"use client"
import AuthPage from "@/component/authPage";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";




export default function Signin(){
    return <AuthPage isSignin={true} onSumbit={async({email,password})=>{
        const res = await axios.post(`${HTTP_BACKEND}/signin`,{email,Password:password})
        const token = res.data.token
        localStorage.setItem("token",token)
        
    }} />
}