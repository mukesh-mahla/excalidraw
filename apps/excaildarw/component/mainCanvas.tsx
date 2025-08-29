import initDraw from "@/draw"
import { useEffect, useRef } from "react"

export function MainCanvas({roomId,socket}:{roomId:string,socket:WebSocket}){
    const canvasRef = useRef<HTMLCanvasElement>(null)


     useEffect(()=>{

    if(canvasRef.current){
                  
     initDraw(canvasRef.current,roomId,socket)
                         
  }
                 },[canvasRef])

    return <div>
        <canvas ref={canvasRef} width={2000} height={1000}></canvas>
        <div className="fixed bottom-0 right-0">
            <button className="bg-white text-black">rect</button>
            <button className="bg-white text-black">circle</button>
        </div>
    </div>
}