import { Request, Response, NextFunction } from "express"
import { z } from "zod"
import { hash } from "bcrypt"
import { prisma } from "@/database/prisma"
import { AppError } from "@/utils/AppError"

class UsersController {
  async create(request: Request, response: Response, next: NextFunction) {
    const bodySchema = z.object({
      name: z.string().trim().min(2),
      email: z.string().email(),
      password: z.string().min(6).trim()
    })

    const { name, email, password } = bodySchema.parse(request.body)

    const userWithSameEmail = await prisma.user.findFirst({where: { email } })
    const hashedPassword = await hash(password, 8)

    if(userWithSameEmail){
      throw new AppError("User with same email already exists")
    }

    const user = await prisma.user.create({
      data:{
        name, email, password: hashedPassword
      }
    })

    const { password: _, ...userWithoutPassword} = user

    return response.status(201).json(userWithoutPassword)

  }
}

export { UsersController }