import z from "zod";
import { email } from "zod/mini";

export const CreateUserSchema = z.object({
    userName:z.string().min(3).max(20),
     email:z.email(),
      Password:z.string().min(6).max(20)
})

export const CreateSigninSchema = z.object({
     email:z.email(),
      Password:z.string().min(6).max(20)
})
export const CreateRoomSchema = z.object({
      slug:z.string().min(3).max(20)
})