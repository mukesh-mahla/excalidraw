"use client"

const WS_BACKEND = process.env.NEXT_PUBLIC_WS_BACKEND


import { useEffect,  useState } from "react"
import { MainCanvas } from "./mainCanvas"

export function Canvas({roomId}:{roomId:string}){

const [socket,setSocket] = useState<WebSocket | null>(null)

useEffect(()=>{
const token = localStorage.getItem("token")
    const ws = new WebSocket(`${WS_BACKEND}?token=${token}`);

    ws.onopen = ()=>{
        setSocket(ws)
        ws.send(JSON.stringify({type:"join_room",
            roomId
        }))
    }
     return () => {
      ws.close()
    }
},[roomId])

if(!socket){
    return <div>
        connecting to server...
    </div>
}
  return <MainCanvas roomId={roomId} socket={socket} />
   
}