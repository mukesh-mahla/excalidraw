import initDraw from "@/draw"
import {  Circle,  Minus, Pencil, RectangleHorizontalIcon } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ButtonIcon } from "./buttonIcon"
type shape = "line" | "rect" | "circle" | "pencil"

export function MainCanvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool,setSelectedTool] = useState<shape>("circle")

    useEffect(()=>{
        //@ts-ignore
      window.selectedTool = selectedTool
    },[selectedTool])

     useEffect(()=>{

    if(canvasRef.current){
                  
     initDraw(canvasRef.current,roomId,socket)
                         
  }
                 },[canvasRef])

    return <div className="h-screen w-screen overflow-hidden">
        <canvas ref={canvasRef} width={2000} height={1000}></canvas>
       <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool}/>
    </div>
}

function Topbar({selectedTool,setSelectedTool}:{selectedTool:shape,setSelectedTool:(s:shape)=>void}){
    return  <div className="fixed top-0 left-0 flex gap-2">
        <ButtonIcon activated={selectedTool === "pencil"} icon={<Pencil/>} onclick={()=>{setSelectedTool("pencil")}}/>
             <ButtonIcon activated={selectedTool === "line"} icon={<Minus/>} onclick={()=>{setSelectedTool("line")}}/>
             <ButtonIcon activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon/>} onclick={()=>{setSelectedTool("rect")}}/>
             <ButtonIcon activated={selectedTool === "circle"} icon={<Circle/>} onclick={()=>{setSelectedTool("circle")}}/>
        </div>
}