import { Canvas } from "@/component/canvas";



export default  function CanvasPage({ params }: any) {
  const { roomId } = params;
  
  return <Canvas roomId={roomId} />;
}