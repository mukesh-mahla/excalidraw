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
    radius:number,
    startAngle:number,
    endAngle:number
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
                               const parsedShape = message.message.shape
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
                         const width = e.clientX - startX;
                         const height = e.clientY - startY;

                        // @ts-ignore
                          const selectedTool = window.selectedTool;
                            let shape: shape | null = null;
                            if (selectedTool === "rect") {

                        shape = {
                              type: "rect",
                               x: startX,
                               y: startY,
                                height,
                                  width
                             }
                      } else if (selectedTool === "circle") {
                           const  radius = Math.max(Math.abs(width),Math.abs(height)) /2
                          const centerX = startX + width / 2
                      const centerY = startY + height / 2
                          shape = {
                              type: "circle",
                              radius: radius,
                              centerX: centerX,
                              centerY: centerY,
                              startAngle:0,
                              endAngle:Math.PI*2
                          }
                      }

                    if (!shape) {
                        return;
                    }

                     exsistinShape.push(shape);
                     clearCtx(ctx,canvas,exsistinShape)
             
                     socket.send(JSON.stringify({
                         type: "chat",
                         message: {
                             shape
                         },
                         roomId
                     }))

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
                        //@ts-ignore
                        const selectedTool = window.selectedTool
                      if(selectedTool === "rect"){
                      
                         ctx.strokeRect(startX,startY,width,height)
                         
                         
                    }else if(selectedTool === "circle"){
                      const centerX = startX + width / 2
                      const centerY = startY + height / 2
                      const  radius = Math.max(Math.abs(width),Math.abs(height)) /2
                      ctx.beginPath()
                      ctx.arc(centerX,centerY,radius,0,Math.PI*2)
                      
                      ctx.stroke()
                      ctx.closePath()
                    }
                  }
                   })
}

function clearCtx(ctx:CanvasRenderingContext2D,canvas:HTMLCanvasElement,exsistinShape:shape[]){
                        ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "rgba(0, 0, 0)"
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    exsistinShape.map((shape) => {
      if (!shape) return; // skip undefined
        if (shape.type === "rect") {
            ctx.strokeStyle = "rgba(255, 255, 255)"
            ctx.strokeRect(shape.x, shape.y, shape.width, shape.height);
        } else if (shape.type === "circle") {
            ctx.beginPath();
            ctx.arc(shape.centerX, shape.centerY, shape.radius, 0, Math.PI * 2);
            ctx.stroke();
            ctx.closePath();                
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