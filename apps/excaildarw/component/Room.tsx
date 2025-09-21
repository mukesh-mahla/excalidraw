"use client"


import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"
import axios from "axios"
import { useRef, useState } from "react"
import { useRouter } from "next/navigation"



const HTTP_BACKEND = process.env.NEXT_PUBLIC_HTTP_BACKEND


export function Room(){
  const router = useRouter()
   const [getroom,setGetroom] = useState("")
   const [createRoom,setCreateRoom] = useState("")
   

async function getRoom() {
  
  const slug = getroom.trim()
 
  const res = await axios.get(`${HTTP_BACKEND}/chats/room/${slug}`)
  const id = res.data.id
   
  router.push(`/canvas/${id}`)
  
}
async function CreateRoom(){

    const slug = createRoom
  const token = localStorage.getItem("token")
  const data = await axios.post(`${HTTP_BACKEND}/room`,{slug},{headers: { Authorization: `${token}`}})

  router.push(`/canvas/${data.data.roomId}`)
  
     

  
}
    return <div className="text-center">
      <div className="mb-2">
       <Input onChange={(e)=>{setGetroom(e.target.value)}}  placeholder="Join room" type="text"/>
     <Button className="border rounded mt-2" variant="primary" size="sm" onClick={getRoom}>join</Button>  </div>
              <p>---------------OR---------------</p>
       <div className="mt-2">
        <Input  onChange={(e)=>{setCreateRoom(e.target.value)}} placeholder="Create room" type="text"/>
     <Button className="border rounded mt-2" variant="primary" size="sm" onClick={CreateRoom}>Create</Button>
    </div></div>
}

