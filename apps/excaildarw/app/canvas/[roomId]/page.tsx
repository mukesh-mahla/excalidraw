import { Canvas } from "@/component/canvas";



export default async  function CanvasPage({ params }: any) {
  const { roomId } = await params;
  
  return <Canvas roomId={roomId} />;
}