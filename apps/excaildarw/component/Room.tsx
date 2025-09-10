"use client"
import { Button } from "@repo/ui/button"
import Input from "@repo/ui/input"


export function Room(){
    return <div className="text-center">
        
       <Input  placeholder="Join room" type="text"/>
     <Button className="border rounded mt-2" variant="primary" size="sm" onClick={()=>{console.log("hello")}}>Search</Button>   
    </div>
}