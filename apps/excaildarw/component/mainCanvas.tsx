import initDraw from "@/draw"
import {   Circle,  Minus, Palette, Pencil, RectangleHorizontalIcon, Redo, Undo } from "lucide-react"
import { useEffect, useRef, useState } from "react"
import { ButtonIcon } from "./buttonIcon"
type shape = "line" | "rect" | "circle" | "pencil" | "color"

export function MainCanvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)
    const [selectedTool,setSelectedTool] = useState<shape>("circle")
    const undoRedoRef = useRef<{ undo: () => void; redo: () => void } | null>(null)

    useEffect(()=>{
        //@ts-ignore
    window.selectedTool = selectedTool
    },[selectedTool])
 
    const [undo,setUndo] = useState()
    const [redo,setRedo] = useState()

     useEffect(()=>{

    if(canvasRef.current){
                  
     initDraw(canvasRef.current,roomId,socket).then(res =>{
        if(!res) return
        undoRedoRef.current = res
     })
                         
  }
                 },[canvasRef])

    return <div className="h-screen w-screen overflow-hidden">
        <canvas ref={canvasRef} width={2000} height={1000}></canvas>
        <Topbar selectedTool={selectedTool} setSelectedTool={setSelectedTool} undoRedoRef={undoRedoRef}/>
    </div>
}

function Topbar({selectedTool,setSelectedTool,undoRedoRef}:{selectedTool:shape,setSelectedTool:(s:shape)=>void, undoRedoRef: React.RefObject<{ undo: () => void; redo: () => void } | null>}){
    return <div className="fixed top-0 left-0 flex gap-2">

             <ButtonIcon activated={selectedTool === "pencil"} icon={<Pencil/>} onclick={()=>{setSelectedTool("pencil")}}/>
             <ButtonIcon activated={selectedTool === "line"} icon={<Minus/>} onclick={()=>{setSelectedTool("line")}}/>
             <ButtonIcon activated={selectedTool === "rect"} icon={<RectangleHorizontalIcon/>} onclick={()=>{setSelectedTool("rect")}}/>
             <ButtonIcon activated={selectedTool === "circle"} icon={<Circle/>} onclick={()=>{setSelectedTool("circle")}}/>
             <ButtonIcon activated={selectedTool === "color"} icon={<Palette/>} onclick={()=>{setSelectedTool("color")}}/>
             <ButtonIcon activated={false} onclick={() => undoRedoRef.current?.undo()} icon={<Undo/>}></ButtonIcon>
             <ButtonIcon activated={false} onclick={() => undoRedoRef.current?.redo()} icon={<Redo/>}></ButtonIcon>
                                
            </div>
}

