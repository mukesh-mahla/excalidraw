"use client"


import { useRef } from "react"


export default function AuthPage({isSignin,onSumbit}:{isSignin:boolean,onSumbit:(values:{userName?:string,email:string,password:string})=>void}){

    const emailRef = useRef<HTMLInputElement>(null)
    const userNameRef = useRef<HTMLInputElement>(null)
    const passwordRef = useRef<HTMLInputElement>(null)

    const handelClick = ()=>{
         console.log("handleClick called")
       let values ={
            userName:userNameRef.current?.value || "",
            email:emailRef.current?.value || "",
            password:passwordRef.current?.value || ""     

        }
        console.log("values from AuthPage:", values)
        onSumbit(values)
       
        
    }

    if(isSignin){
        return <div className="w-screen h-screen flex justify-center items-center">
     <div className="p-2 m-2 border-2 rounded-md bg-white">
     <div className="p-2 mb-2 ">   <input ref={emailRef} className="p-2" type="text" placeholder="email" /> </div>
     <div className="p-2 mb-2 ">   <input ref={passwordRef} className="p-2" type="password" placeholder="password" /> </div>
     <div className="p-2 flex justify-center border-2 rounded">   
       <button className=" px-2" onClick={handelClick}>{isSignin ? "signin":"signup"}</button>
 </div>  
</div>
      </div>
    }else{
        return <div className="w-screen h-screen flex justify-center items-center">
<div className="p-2 m-2 border-2 rounded-md bg-white ">
    <div className="p-2  mb-2"> <input ref={userNameRef} className="p-2" type="text" placeholder="userName" /> </div>
    <div className="p-2  mb-2"> <input ref={emailRef} className="p-2" type="text" placeholder="email" />  </div>
    <div className="p-2  mb-2"> <input ref={passwordRef} className="p-2" type="password" placeholder="password" />  </div>
    <div className="p-2 flex justify-center border-2 rounded"> 
    <button className=" px-2" onClick={handelClick}>{isSignin ? "signin":"signup"}</button></div>
</div>
      </div>
    }
  
}