"use client"
import { useEffect, useRef } from "react";

export default function Canvas(){
    const canvasRef = useRef<HTMLCanvasElement>(null)

    useEffect(()=>{

    if(canvasRef.current){
                  const canvas = canvasRef.current
                  const ctx = canvas.getContext("2d")

                    if(!ctx){
                      return
                      }

                      let click = false
                      let startX = 0
                      let startY = 0
                   canvas.addEventListener("mousedown",(e)=>{
                    click = true
                                  startX = e.clientX
                                  startY = e.clientY
                   })
                   canvas.addEventListener("mouseup",(e)=>{
                    click = false
                                  console.log(e.clientX)
                   })
                   canvas.addEventListener("mousemove",(e)=>{
                    if(click){
                        const width = e.clientX-startX
                        const height = e.clientY-startY
                                  
                        ctx.clearRect(0,0,canvas.width,canvas.height)
                         ctx.strokeRect(startX,startY,width,height)
                    }
                   })
  }


                 },[canvasRef])

    return <div>
        <canvas ref={canvasRef} width={1000} height={1000}></canvas>
    </div>
}