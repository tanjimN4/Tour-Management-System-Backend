import { Types } from "mongoose";


export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    USER = "USER",
    ADMIN = "ADMIN",
    GUIDE = "GUIDE",
}

export interface IAuthProvider {
    provider :"google" | "credentials"; //google,facebook,credential
    providerId:string;
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}
export interface IUser {
    _id?: Types.ObjectId;
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: boolean;
    role: Role;

    auths:IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}