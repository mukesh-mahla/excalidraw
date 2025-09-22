"use client"

import AuthPage from "@/component/authPage";

import axios from "axios";
import { useRouter } from "next/navigation";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND



export default function Signin(){
    const router = useRouter()
    return <AuthPage isSignin={true} onSumbit={async({email,password})=>{
         
        const res = await axios.post(`${HTTP_BACKEND}/signin`,
            {email, Password: password},

         {headers:{"Content-Type": "application/json"
    }}
)
        const token = res.data.token
        localStorage.setItem("token",token)
        router.push("/room")
    }} />
}