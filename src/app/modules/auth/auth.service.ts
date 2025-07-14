/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
import { cerateNewAccessTokenWithRefreshToken, createUserToken } from "../../utils/userTokens"
import { IUser } from "../user/user.interface"
import User from "../user/user.model"
const credentialsLogin = async(payload : Partial<IUser>)=>{
    const {email,password} = payload

    const isUserExist = await User.findOne({email})

    if(!isUserExist){
        throw new AppError(httpStatus.BAD_REQUEST,'Email does not exist')
    }
    const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

    if(!isPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,'Password does not match')
    }

    // const jwtPayload = {
    //     userId:isUserExist._id,
    //     email:isUserExist.email,
    //     role:isUserExist.role
    // }
    // console.log(jwtPayload);
    
    // // const accessToken= jwt.sign(jwtPayload,'secret',{expiresIn:'1d'})

    // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRE)

    // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRE)

    const userTokens=createUserToken(isUserExist)

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const {password : pass ,...rest} = isUserExist.toObject()
    return {
        accessToken :userTokens.accessToken,
        refreshToken :userTokens.refreshToken,
        user:rest
    }
}
const getNewAccessToken = async(refreshToken : string)=>{
    const newAccessToken= await cerateNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken :newAccessToken
    }
}
const resetPassword = async(oldPassword : string,newPassword : string,decodeToken : JwtPayload)=>{

    const user = await User.findById(decodeToken.userId)

    const isOldPasswordMatched = await bcryptjs.compare(oldPassword,user!.password as string)
    if(!isOldPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,'Old password does not match')
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save()
}

export const AuthServices = {
    credentialsLogin,
    getNewAccessToken,
    resetPassword
}