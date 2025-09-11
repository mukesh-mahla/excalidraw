
import { Room } from "@/component/Room";


export default function CreateRoom() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-black to-gray-800 p-6">
      {/* Card */}
      <div className="w-full max-w-md bg-[#CC66DA] p-6 rounded-2xl shadow-2xl border-2 border-white/10">
        <Room  />
      </div>
    </div>
  );
}


