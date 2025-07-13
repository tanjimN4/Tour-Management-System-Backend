import bcryptjs from "bcryptjs"
import httpStatus from "http-status-codes"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
import { generateToken } from "../../utils/jwt"
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

    const jwtPayload = {
        userId:isUserExist._id,
        email:isUserExist.email,
        role:isUserExist.role
    }
    console.log(jwtPayload);
    
    // const accessToken= jwt.sign(jwtPayload,'secret',{expiresIn:'1d'})

    const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRE)
    return {
        accessToken
    }
}

export const AuthServices = {
    credentialsLogin
}