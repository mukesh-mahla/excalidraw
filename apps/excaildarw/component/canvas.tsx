"use client"

import { WS_BACKEND } from "@/config"

import { useEffect, useRef, useState } from "react"
import { MainCanvas } from "./mainCanvas"

export function Canvas({roomId}:{roomId:string}){

const [socket,setSocket] = useState<WebSocket | null>(null)

useEffect(()=>{

    const ws = new WebSocket(`${WS_BACKEND}`);

    ws.onopen = ()=>{
        setSocket(ws)
        ws.send(JSON.stringify({type:"join_room",
            roomId
        }))
    }
},[])

if(!socket){
    return <div>
        connecting to server...
    </div>
}
  return <MainCanvas roomId={roomId} socket={socket} />
   
}