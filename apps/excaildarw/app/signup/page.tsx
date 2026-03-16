"use client"

import axios from "axios"
import { useRouter } from "next/navigation"
import { useState } from "react"

const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND

export default function Signup(){

  const router = useRouter()

  const [userName,setUserName] = useState("")
  const [email,setEmail] = useState("")
  const [password,setPassword] = useState("")

  async function handleSignup(){

    await axios.post(`${HTTP_BACKEND}/signup`,
      {userName,email,Password:password},
      {headers:{"Content-Type":"application/json"}}
    )

    router.push("/signin")
  }

  return(
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-neutral-950 via-neutral-900 to-black text-white px-4">

      <div className="w-full max-w-md bg-white/[0.03] border border-white/10 rounded-xl p-8">

        <h1 className="text-2xl font-semibold text-center">
          Create account
        </h1>

        <div className="mt-8 space-y-4">

          <input
            placeholder="Username"
            value={userName}
            onChange={(e)=>setUserName(e.target.value)}
            className="w-full h-11 px-3 rounded-md bg-black border border-white/10 focus:outline-none focus:border-purple-500"
          />

          <input
            placeholder="Email"
            value={email}
            onChange={(e)=>setEmail(e.target.value)}
            className="w-full h-11 px-3 rounded-md bg-black border border-white/10 focus:outline-none focus:border-purple-500"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e)=>setPassword(e.target.value)}
            className="w-full h-11 px-3 rounded-md bg-black border border-white/10 focus:outline-none focus:border-purple-500"
          />

          <button
            onClick={handleSignup}
            className="w-full h-11 rounded-md bg-purple-600 hover:bg-purple-700 transition active:scale-95"
          >
            Create account
          </button>

        </div>

      </div>

    </div>
  )
}