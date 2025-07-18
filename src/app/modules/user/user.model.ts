import mongoose, { model } from "mongoose";
import { IsActive, IUser, Role } from "./user.interface";

const authProviderSchema = new mongoose.Schema({
    provider: {
        type: String,
        required: true
    },
    providerId: {
        type: String,
        required: true
    }
},
    {
        versionKey: false,
        _id: false
    })

const userSchema = new mongoose.Schema<IUser>({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
    },
    age: {
        type: Number
    },
    role: {
        type: String,
        enum: Object.values(Role),
        default: Role.USER
    },
    phone: {
        type: String,
    },
    picture: {
        type: String,
    },
    address: {
        type: String,
    },
    isDeleted: {
        type: Boolean,
        default: "false"
    },
    isActive: {
        type: String,
        enum: Object.values(IsActive),
        default: IsActive.ACTIVE
    },
    isVerified: {
        type: Boolean,
        default: "false"
    },
    auths: [authProviderSchema],
},
    {
        timestamps: true,
        versionKey: false
    })

const User = model<IUser>('User', userSchema)
export default User