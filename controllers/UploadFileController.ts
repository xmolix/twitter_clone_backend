import express from "express";
import cloudinary from "../core/cloudinary"

class UploadFileController {
    async upload(req: express.Request, res: express.Response): Promise<void> {
        const file = req.file

        cloudinary.uploader.upload_stream({ resource_type: "auto" }, (err, callResult) => {
            if (err || !callResult) {
                return res.status(500).json({
                    status: "error",
                    message: err || "upload error",
                })
            }

            res.status(201).json({
                status: "success",
            })
        }).end(file?.buffer)
    }
}

export const UploadFileCtrl = new UploadFileController()