import {Document, model, Schema} from "mongoose";
import {UserModelType} from "./UserModel";

const TweetSchema = new Schema<TweetModelType>({
    text: {
        required: true,
        type: String,
        minlength: 1,
        maxlength: 280,
    },
    user: {
        required: true,
        ref: "User",
        type: Schema.Types.ObjectId,
    },
}, {
    timestamps: true,
})

export const TweetModel = model<TweetModelDocumentType>("Tweet", TweetSchema)

export type TweetModelType = {
    _id?: string,
    text: string,
    user: UserModelType | string | undefined,
}

type TweetModelDocumentType = TweetModelType & Document