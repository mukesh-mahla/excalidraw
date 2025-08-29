import { HTTP_BACKEND } from "@/config"
import axios from "axios"

type shape ={
    type : "rect",
    x : number,
    y : number,
    width:number,
    height:number

} | {
    type : "circle",
    centerX:number,
    centerY:number,
    radius:number
}


export default async function initDraw(canvas:HTMLCanvasElement,roomId:string,socket:WebSocket){

  let exsistinShape:shape[]  = await getExistingShape(roomId)
    
                  const ctx = canvas.getContext("2d")

                    if(!ctx){
                      return
                      }

                      socket.onmessage = (event)=>{
                        const message = JSON.parse(event.data)
                        if(message.type == "chat"){
                               const parsedShape = message.message
                               exsistinShape.push(parsedShape)
                           clearCtx(ctx,canvas,exsistinShape)
                        }
                      }
                              clearCtx(ctx,canvas,exsistinShape)
                      let click = false
                      let startX = 0
                      let startY = 0
                   canvas.addEventListener("mousedown",(e)=>{
                    click = true
                     const rect = canvas.getBoundingClientRect();
     

                                  startX = e.clientX- rect.left;
                                  startY = e.clientY - rect.top;

                   })
                   canvas.addEventListener("mouseup",(e)=>{
                    click = false
                                  console.log(e.clientX)
                                  const rect = canvas.getBoundingClientRect();
                                    const endX = e.clientX- rect.left
                                    const endY = e.clientY-rect.top

                                     const width = endX-startX
                                     const height = endY-startY
                                     const shape:shape = {
                                      type:"rect",
                                      x:startX,
                                      y:startY,
                                      width,
                                      height
                                     }
                                  exsistinShape.push(shape)

                                  socket.send(JSON.stringify({
                                    type:"chat",
                                    message:JSON.stringify({shape}),
                                    roomId
                                  })
                                    
                                    )
                   })
                   canvas.addEventListener("mousemove",(e)=>{
                    if(click){
                       const rect = canvas.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
                        const width = currentX-startX
                        const height = currentY-startY
                                  clearCtx(ctx,canvas,exsistinShape)
                       
                        ctx.strokeStyle="rgba(255,255,255)"
                         ctx.strokeRect(startX,startY,width,height)
                    }
                   })
}

function clearCtx(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement,exsistinShape:shape[]){
 ctx.clearRect(0,0,canvas.width,canvas.height)
                         ctx.fillStyle="rgba(0,0,0)"
                        ctx.fillRect(0,0,canvas.width,canvas.height)

                        exsistinShape.map((shape)=>{
                          if(shape.type === "rect"){
                             ctx.strokeStyle="rgba(255,255,255)"
                         ctx.strokeRect(shape.x,shape.y,shape.width,shape.height)
                          }
                        })
}

async function getExistingShape(roomId:string){
  const res = await axios.get(`${HTTP_BACKEND}/chats/${roomId}`)
  const messages = res.data.message

  const shapes = messages.map((x:{message:string})=>{
           const messageData = JSON.parse(x.message)
           return messageData.shape
  })
return shapes

}