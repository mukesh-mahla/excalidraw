"use client"
import AuthPage from "@/component/authPage";
import { HTTP_BACKEND } from "@/config";
import axios from "axios";
import { useRouter } from "next/navigation";

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