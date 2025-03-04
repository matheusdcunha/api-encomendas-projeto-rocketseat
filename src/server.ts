import { app } from "@/app";
import { env } from "./env";

app.listen(env.PORT, ()=>{
  console.log(`Server está rodando na porta ${env.PORT}`)
})