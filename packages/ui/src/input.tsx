"use client";

import { ReactHTMLElement } from "react";

function Input({  type , placeholder,value,  onChange,Inputref,className  }:{Inputref?:React.RefObject<HTMLInputElement | null>,value?:string,className?:string,type?:string,placeholder:string,onChange?:(e:any)=>void}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      
      <input
      value={value}
       ref={Inputref}
        type={type}
        placeholder={placeholder}
        
          {...(onChange ? { onChange } : {})}
        className="px-3 py-2 border rounded-lg focus:outline-none text-center focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Input;
