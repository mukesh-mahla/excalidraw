import { ReactNode } from "react";

export function ButtonIcon({icon,onclick,activated}:{icon:ReactNode,onclick:()=>void,activated:boolean}){
    return <div className={`pointer rounded-full border  p-2  bg-black  hover:bg-grey ${activated ? "text-red-400":"text-white"}`} onClick={onclick}>{icon}</div>
}