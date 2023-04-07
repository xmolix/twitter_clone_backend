import express from "express";
import {TweetModel, TweetModelType} from "../models/TweetModel";
import {isValidObjectID} from "../utils/isValidObjectID";
import {validationResult} from "express-validator";
import {UserModelType} from "../models/UserModel";

class TweetController {
    async index(_: express.Request, res: express.Response): Promise<void> {
        try {
            const tweets = await TweetModel.find({}).populate("user").sort({ "createdAt": -1 }).exec()

            res.status(200).json({
                status: "success",
                data: tweets
            })
        } catch (err) {
            res.status(500).json({
               status: "error",
               message: err,
            })
        }
    }

    async show(req: express.Request, res: express.Response): Promise<void> {
        try {
            const tweetID = req.params.id

            if (!isValidObjectID(tweetID)) {
                res.status(400).send()
                return
            }

            const tweet = await TweetModel.findById(tweetID).populate("user").exec()

            if (!tweet) {
                res.status(404).send()
                return
            }

            res.status(200).json({
                status: "success",
                data: tweet,
            })
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err,
            })
        }
    }

    async create(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelType

            if (user) {
                const errors = validationResult(req)
                if (!errors.isEmpty()) {
                    res.status(400).json({
                        status: "error",
                        messages: errors.array()
                    })

                    return
                }

                const data: TweetModelType = {
                    text: req.body.text,
                    user: user._id,
                }

                const tweet = await TweetModel.create(data)

                res.status(201).json({
                    status: "success",
                    data: await tweet.populate("user"),
                })
            }
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err,
            })
        }
    }

    async update(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelType

            if (user) {
                const tweetID = req.params.id

                if (!isValidObjectID(tweetID)) {
                    res.status(400).json({
                        status: "error",
                        message: "tweetID not found"
                    })

                    return
                }

                const tweet = await TweetModel.findById(tweetID)

                if (tweet) {
                    if (String(tweet.user) === String(user._id)) {
                        await TweetModel.findById(tweetID).updateOne({ text: req.body.text })
                        res.status(200).json({
                            status: "success",
                            message: "Tweet successful updated."
                        })
                    } else {
                        res.status(403).json({
                            status: "error",
                            message: "This tweet don't belong this user."
                        })
                    }
                }
            }
        } catch (err) {
            res.status(500).json({
                status: "error",
                message: err,
            })
        }
    }

    async delete(req: express.Request, res: express.Response): Promise<void> {
        try {
            const user = req.user as UserModelType

            if (user) {
                const tweetID = req.params.id

                if (!isValidObjectID(tweetID)) {
                    res.status(400).json({
                        status: "error",
                        message: "tweetID not found"
                    })

                    return
                }

                const tweet = await TweetModel.findById(tweetID)

                if (tweet) {
                    if (String(tweet.user) === String(user._id)) {
                        await TweetModel.deleteOne({ _id: tweetID })
                        res.status(200).json({
                            status: "success",
                            message: "Tweet successful deleted."
                        })
                    } else {
                        res.status(403).json({
                            status: "error",
                            message: "This tweet don't belong this user."
                        })
                    }
                } else {
                    res.status(404).json({
                        status: "error",
                        message: "Tweet is not found."
                    })
                }
            }
        } catch (err) {
            res.status(500).json({
                status: "Error",
                message: err,
            })
        }
    }
}

export const TweetCtrl = new TweetController()