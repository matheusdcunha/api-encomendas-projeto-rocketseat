import request from "supertest"
import { prisma } from "@/database/prisma"
import { app } from "../app"

describe("UserController", ()=>{

  let user_id: string

  afterAll(async ()=>{
    await prisma.user.delete({
      where:{
        id: user_id
      }
    })
  })

  it("should create a new user sucessfully", async ()=>{
    const response = await request(app).post("/users").send({
      name: "Test User",
      email:"testuser@example.com",
      password: "teste0101"
    })

    expect(response.status).toBe(201)
    expect(response.body).toHaveProperty("id")
    expect(response.body.name).toBe("Test User")


    user_id = response.body.id

  })
  
  it("should throw a error if user with same email already exists", async ()=>{
    const response = await request(app).post("/users").send({
      name: "Duplicate User",
      email:"testuser@example.com",
      password: "teste0101"
    })

    expect(response.status).toBe(400)
    expect(response.body.message).toBe("User with same email already exists")
  })

  it("should throw a validation error if email is invalid", async ()=>{
    const response = await request(app).post("/users").send({
      name:"Test User",
      email:"ivalid",
      password: "teste01"
    })

    expect(response.status).toBe(400);
    expect(response.body.message).toBe("validation error");

  })

  

})