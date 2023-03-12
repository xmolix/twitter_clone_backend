// @ts-ignore
import express from "express"

const app = express()

app.get("/users")

app.listen(6666, (err): void => {
   if (err) {
      throw new Error(err)
   }

   console.log("SERVER IS RUNNING!")
})