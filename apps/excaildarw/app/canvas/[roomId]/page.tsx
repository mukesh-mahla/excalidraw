import { Canvas } from "@/component/canvas";

type Props = {
  params: { roomId: string };
  searchParams?: { [key: string]: string | string[] | undefined };
};

export default function CanvasPage({ params }: Props) {
  const { roomId } = params;
  
  return <Canvas roomId={roomId} />;
}