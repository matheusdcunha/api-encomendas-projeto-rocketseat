import { Request, Response, NextFunction } from "express"
import { authConfig } from "@/configs/auth"
import { AppError } from "@/utils/AppError"
import { compare } from "bcrypt"
import { prisma } from "@/database/prisma"
import { sign, SignOptions } from "jsonwebtoken"
import { z } from "zod"

class SessionsController {
  async create(request: Request, response: Response, next: NextFunction) {

    const bodySchema = z.object({
      email: z.string().email(),
      password: z.string().min(6)
    })

    const { email, password } = bodySchema.parse(request.body)

    const user = await prisma.user.findFirst({ where: { email } })

    if (!user) {
      throw new AppError("Invalid email or password", 401)
    }

    const passwordMatched = await compare(password, user.password)

    if (!passwordMatched) {
      throw new AppError("Invalid email or password", 401)
    }

    const { secret, expiresIn } = authConfig.jwt

    const options: SignOptions = {
      expiresIn,
      subject: user.id
    }

    const token = sign({role: user.role ?? "customer"}, secret, options)

    const {password: hashedPassword, ...userWithouPassword}= user


    return response.json({...userWithouPassword, token})
  }
}

export { SessionsController }