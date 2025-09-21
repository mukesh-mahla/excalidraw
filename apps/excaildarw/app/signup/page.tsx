"use client"

import AuthPage from "@/component/authPage";

import axios from "axios";
import { useRouter } from "next/navigation";

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND

export default function Signup(){
    const router = useRouter()
    return <AuthPage isSignin={false} onSumbit={async({userName,email,password})=>{
        const res = await axios.post(`${HTTP_BACKEND}/signup`,{
            userName,
            email,
            Password:password
        })

        router.push("/signin")
    }}
     />
}