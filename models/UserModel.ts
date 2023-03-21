import {model, Schema, Document } from "mongoose";

const UserSchema = new Schema<UserModelType>({
    email: {
        unique: true,
        required: true,
        type: String,
    },
    fullName: {
        required: true,
        type: String,
    },
    userName: {
        unique: true,
        required: true,
        type: String,
    },
    password: {
        required: true,
        type: String,
        select: false,
    },
    confirmed: {
        type: Boolean,
        default: false,
    },
    confirmHash: {
        required: true,
        type: String,
        select: false,
    },
    location: String,
    about: String,
    website: String,
}, {
    timestamps: true,
})

UserSchema.set("toJSON", {
    transform: function (_, obj) {
        delete obj.password
        delete obj.confirmHash
        return obj
    }
})

export const UserModel = model<UserModelDocumentType>("User", UserSchema)

export type UserModelType = {
    _id?: string,
    email: string,
    fullName: string,
    userName: string,
    password: string,
    confirmed?: boolean,
    confirmHash: string,
    location?: string,
    about?: string,
    website?: string,
}

export type UserModelDocumentType = UserModelType & Document