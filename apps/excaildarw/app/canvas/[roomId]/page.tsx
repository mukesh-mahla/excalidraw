
import { Canvas } from "@/component/canvas";
import initDraw from "@/draw";
import { useEffect, useRef } from "react";

export default async function Canvaspage({params}:{params:{
    roomId:string;
}}){
    const roomId = await params.roomId
    console.log(roomId)
    return <Canvas roomId={roomId}/>
}