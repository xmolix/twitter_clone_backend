import express from "express";
import jwt from "jsonwebtoken"
import {UserModel, UserModelDocumentType, UserModelType} from "../models/UserModel";
import {validationResult} from "express-validator";
import {generateMD5} from "../utils/generateHash";
import {sendEmail} from "../utils/sendEmail";
import {isValidObjectID} from "../utils/isValidObjectID";

class UserController {
    async index(_: any, res: express.Response): Promise<void> {
        try {
            const users = await UserModel.find({}).exec()

            res.status(200).json({
                status: "success",
                data: users
            })
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: JSON.stringify(err)
            })
        }
    }

    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const userID = req.params.id

            if (!isValidObjectID(userID)) {
                res.status(400).send()
                return
            }

            const user = await UserModel.findById(userID).exec()

            if (!user) {
                res.status(404).send()
                return
            }

            res.json({
                status: "success",
                data: user,
            })
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: JSON.stringify(err)
            })
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const errors = validationResult(req)
            if (!errors.isEmpty()) {
                res.status(400).json({ status: "error", messages: errors.array() })
                return
            }

            const data: UserModelType = {
                email: req.body.email,
                fullName: req.body.fullName,
                userName: req.body.userName,
                password: generateMD5(req.body.password + process.env.SECRET_KEY),
                confirmHash: generateMD5(process.env.SECRET_KEY + Math.random().toString()),
            }

            const user = await UserModel.create(data)

            sendEmail({
                emailFrom: "admin@twitter.com",
                emailTo: data.email,
                subject: "Подтверждение почты Twitter_Clone",
                html: `Для того, чтобы подтвердить почту, перейдите <a href="http://localhost:${
                    process.env.PORT
                }/auth/verify?hash=${data.confirmHash}">по этой ссылке</a>`,
            },
                (err: Error | null) => {
                    if (err) {
                        res.status(500).json({
                            status: "error",
                            message: err
                        })
                    } else {
                        res.status(201).json({
                            status: "success",
                            data: user
                        })
                    }
                })
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: JSON.stringify(err)
            })
        }
    }

    async verify(req: express.Request, res: express.Response): Promise<void> {
        try {
            const hash = req.query.hash
            if (!hash) {
                res.status(400).send()
                return
            }

            const user = await UserModel.findOne({ confirmHash: hash }).exec()

            if (user) {
                user.confirmed = true
                await user.save()

                res.status(200).json({
                    status: "success",
                })
            } else {
                res.status(404).json({
                    status: "error",
                    message: "User not found."
                })
            }
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: JSON.stringify(err)
            })
        }
    }

    async singin(req: express.Request, res: express.Response): Promise<void> {
        try {
            if (req.user && process.env.SECRET_KEY) {
                const user = (req.user as UserModelDocumentType).toJSON()

                res.status(200).json({
                    status: "success",
                    data: {
                        user,
                        token: jwt.sign({ userData: req.user }, process.env.SECRET_KEY, {
                            expiresIn: "30 days"
                        }),
                    }
                })
            }
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err
            })
        }
    }

    async getUserInfo(req:express.Request, res: express.Response): Promise<void> {
        try {
            if (req.user) {
                const user = (req.user as UserModelDocumentType).toJSON()

                res.status(200).json({
                    status: "success",
                    data: user
                })
            }
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err,
            })
        }
    }
}

export const UserCtrl = new UserController()