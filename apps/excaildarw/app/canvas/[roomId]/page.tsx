
import { Canvas } from "@/component/canvas";




export default async function Canvaspage({params}:{params:{
    roomId:string;
}}){
    const roomId = (await params).roomId
    console.log(roomId)
    return <Canvas roomId={roomId} />
}