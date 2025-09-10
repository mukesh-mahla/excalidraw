"use client";

function Input({  type , placeholder,  onChange }:{type:string,placeholder:string,onChange?:()=>void}) {
  return (
    <div className="flex flex-col gap-2 mb-4">
      
      <input
        type={type}
        placeholder={placeholder}
        
          {...(onChange ? { onChange } : {})}
        className="px-3 py-2 border rounded-lg focus:outline-none text-center focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
}

export default Input;
