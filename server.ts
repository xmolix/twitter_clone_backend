import dotenv from "dotenv"
dotenv.config()

import "./core/db"

import express from "express"
import { passport } from "./core/passport"
import session from "express-session"
import { UserCtrl } from "./controllers/UserController"
import { registerValidations } from "./validations/register"
import {TweetCtrl} from "./controllers/TweetController";
import {tweetsValidations} from "./validations/tweets";

const app = express()

app.use(express.json())
app.use(passport.initialize())
app.use(session({
    secret: '9jWnk0l71wzp9ks02Jq',
    resave: false,
    saveUninitialized: false
}))

app.get("/users", UserCtrl.index)
app.get("/users/me", passport.authenticate("jwt", { session: false }), UserCtrl.getUserInfo)
app.get("/users/:id", UserCtrl.show)

app.get("/auth/verify", registerValidations, UserCtrl.verify)
app.post("/auth/sign-up", registerValidations, UserCtrl.create)
app.post("/auth/sign-in", passport.authenticate("local"), UserCtrl.login)
// { failureRedirect: '/', failureMessage: true }

app.get("/tweets", TweetCtrl.index)
app.post("/tweets", passport.authenticate("jwt"), tweetsValidations, TweetCtrl.create)
app.patch("/tweets/:id", passport.authenticate("jwt"), tweetsValidations, TweetCtrl.update)
app.get("/tweets/:id", TweetCtrl.show)
app.delete("/tweets/:id", passport.authenticate("jwt"), TweetCtrl.delete)

app.listen(process.env.PORT, (): void => {
   console.log("SERVER IS RUNNING!")
})