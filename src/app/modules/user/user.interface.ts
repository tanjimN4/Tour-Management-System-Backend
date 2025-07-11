import { Types } from "mongoose";


export enum Role {
    SUPER_ADMIN = "SUPER_ADMIN",
    USER = "USER",
    ADMIN = "ADMIN",
    GUIDE = "GUIDE",
}

export interface IAuthProvider {
    provider :string; //google,facebook,credential
    providerId:string;
}
export enum IsActive {
    ACTIVE = "ACTIVE",
    INACTIVE = "INACTIVE",
    BLOCKED = "BLOCKED",
}
export interface IUser {
    name: string;
    email: string;
    password?: string;
    phone?: string;
    picture?: string;
    address?: string;
    isDeleted?: string;
    isActive?: IsActive;
    isVerified?: string;
    roll: Role;

    auths:IAuthProvider[];
    bookings?: Types.ObjectId[];
    guides?: Types.ObjectId[];
}