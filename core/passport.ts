import passport from "passport"
import {Strategy} from "passport-local"
import {UserModel, UserModelType} from "../models/UserModel";
import {generateMD5} from "../utils/generateHash";
import {Strategy as JWTStrategy, ExtractJwt} from "passport-jwt";


passport.use(new Strategy({
        usernameField: "userName",
        passwordField: "password",
    }, async (userName, password, done): Promise<void> => {
    try {
        const user = await UserModel
            .findOne({ $or: [{ email: userName }, { userName }] })
            .select("+password")
            .exec()

        if (!user) {
            return done(null, false)
        }

        if (user.password === generateMD5(password + process.env.SECRET_KEY)) {
            done(null, user)
        } else {
            done(null, false)
        }
    } catch (err) {
        done(err, false)
    }
}))

passport.use(new JWTStrategy(
    {
        secretOrKey: process.env.SECRET_KEY,
        jwtFromRequest: ExtractJwt.fromHeader("token")
    },
    async (payload: { userData: UserModelType }, done): Promise<void> => {
        try {
            const user = await UserModel.findById(payload.userData._id).exec()

            if (user) {
                return done(null, user)
            }

            done(null, false)
        } catch (err) {
            done(err, false)
        }
    }
))

passport.serializeUser((user: UserIDType, done) => {
    done(null, user?._id)
})

passport.deserializeUser((id, done) => {
    UserModel.findById(id, (err: NativeError, user: UserIDType) => {
        done(err, user)
    })
})

export { passport }


type UserIDType = {
    _id?: string
}