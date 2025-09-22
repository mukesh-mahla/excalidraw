"use client"

import AuthPage from "@/component/authPage";

import axios from "axios";

import { useRouter } from "next/navigation";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND
console.log("HTTP_BACKEND", HTTP_BACKEND)

export default function Signup(){
    console.log("jijij")
    const router = useRouter()
    return <AuthPage isSignin={false} onSumbit={async({userName,email,password})=>{
        const payload = { userName, email, Password: password }
        const res = await axios.post(`${HTTP_BACKEND}/signup`,{
            payload
        },{
  headers: {
    "Content-Type": "application/json"
    
  }
})
        console.log(password)
        console.log(res)

        router.push("/signin")
    }}
     />
}