import dotenv from "dotenv"
import {WebSocket, WebSocketServer} from "ws";
import  Jwt, { JwtPayload }  from "jsonwebtoken";
import { JWT_SECERET } from "@repo/backend-common/config";

dotenv.config()
const PORT = Number(process.env.PORT) || 8080
const wss = new WebSocketServer({ port: PORT });
import { prisma } from "@repo/db/client";


interface User{
  ws:WebSocket,
  rooms:string[],
  userId:string
}
 
const users:User[] = []

function authUser(token:string):string | null{
  try{
      const decoded = Jwt.verify(token,JWT_SECERET)
        if(typeof decoded ==="string"){
             return null
           }

          if(!decoded || !(decoded as JwtPayload).id){
            return null
       }
          return decoded.id
        }catch(e){
          return null
        }
}

wss.on('connection', function connection(ws,request) {
  const url = request.url
  if(!url){
    return
  } 

  const queryParams= new URLSearchParams(url.split("?")[1])
  const token = queryParams.get("token") ?? ""
     const userId =   authUser(token)

     if(userId == null){
      ws.close()
      return null
     }

  users.push({
    userId,
    rooms:[],
    ws
  })


  ws.on('message',async function message(data) {
     const parseData = JSON.parse(data as unknown as string) // type = "join-room" roomid=1
        if(parseData.type === "join_room"){
             const user = users.find(x=>x.ws === ws);
                user?.rooms.push(parseData.roomId)
          }

          if(parseData.type === "leave_room"){
             const user = users.find(x=>x.ws===ws);
             if(!user){return}
                user.rooms = user.rooms.filter(x => x  !== parseData.roomId)
          }
           if(parseData.type ==="chat"){
                 const roomId = parseData.roomId
                   const message  = parseData.message

                    await prisma.chat.create({
                      data:{
                        roomId:Number(roomId),
                        message:JSON.stringify(message),
                        userId
                      }
                    })
                   users.forEach(user=>{
                    if(user.rooms.includes(roomId)){
                        user.ws.send(JSON.stringify({
                          type:"chat",
                          message:message,
                          roomId
                        }))
                    }
                   })
                }

        });

 
});