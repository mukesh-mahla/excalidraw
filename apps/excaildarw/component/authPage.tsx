"use client"
export default function AuthPage({isSignin}:{isSignin:boolean}){

    if(isSignin){
        return <div className="w-screen h-screen flex justify-center items-center">
<div className="p-2 m-2 border-2 rounded-md bg-white">
  <div className="p-2 mb-2 ">    <input className="p-2" type="text" placeholder="email" /></div>
  <div className="p-2 mb-2 ">    <input className="p-2" type="text" placeholder="password" /></div>
  <div className="p-2 flex justify-center border-2 rounded">    <button className=" px-2" onClick={()=>{  }}>{isSignin ? "signin":"signup"}</button></div>  
</div>
      </div>
    }else{
        return <div className="w-screen h-screen flex justify-center items-center">
<div className="p-2 m-2 border-2 rounded-md bg-white ">
   <div className="p-2  mb-2"> <input className="p-2" type="text" placeholder="userName" /></div>
   <div className="p-2  mb-2"> <input className="p-2" type="text" placeholder="email" /></div>
   <div className="p-2  mb-2"> <input className="p-2" type="text" placeholder="password" /></div>
   <div className="p-2 flex justify-center border-2 rounded"> <button className=" px-2" onClick={()=>{  }}>{isSignin ? "signin":"signup"}</button></div>
</div>
      </div>
    }
  
}