type shape ={
    type : "rect",
    x : number,
    y : number,
    width:number,
    height:number

} | {
    type : "circule",
    centerX:number,
    centerY:number,
    radius:number
}


export default function initDraw(canvas:HTMLCanvasElement){

  let exsistinShape:shape[]  =[]
    
                  const ctx = canvas.getContext("2d")

                    if(!ctx){
                      return
                      }
                                ctx.fillStyle="rgba(0,0,0)"
                            ctx.fillRect(0,0,canvas.width,canvas.height)

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
                                     const width = e.clientX-startX
                        const height = e.clientY-startY
                                  exsistinShape.push({type:"rect",
                                    x:startX,
                                    y:startY,
                                    width,
                                    height
                                  })
                   })
                   canvas.addEventListener("mousemove",(e)=>{
                    if(click){
                        const width = e.clientX-startX
                        const height = e.clientY-startY
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