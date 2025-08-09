/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import bcryptjs from "bcryptjs";
import httpStatus from "http-status-codes";
import jwt, { JwtPayload } from "jsonwebtoken";
import { envVars } from "../../config/env";
import AppError from "../../errorHelpers/AppError";
import { sendEmail } from "../../utils/sendEmail";
import { cerateNewAccessTokenWithRefreshToken } from "../../utils/userTokens";
import { IAuthProvider, IsActive } from "../user/user.interface";
import User from "../user/user.model";
 
// const credentialsLogin = async(payload : Partial<IUser>)=>{
//     const {email,password} = payload

//     const isUserExist = await User.findOne({email})

//     if(!isUserExist){
//         throw new AppError(httpStatus.BAD_REQUEST,'Email does not exist')
//     }
//     const isPasswordMatched = await bcryptjs.compare(password as string,isUserExist.password as string)

//     if(!isPasswordMatched){
//         throw new AppError(httpStatus.BAD_REQUEST,'Password does not match')
//     }

//     // const jwtPayload = {
//     //     userId:isUserExist._id,
//     //     email:isUserExist.email,
//     //     role:isUserExist.role
//     // }
//     // console.log(jwtPayload);
    
//     // // const accessToken= jwt.sign(jwtPayload,'secret',{expiresIn:'1d'})

    // const accessToken = generateToken(jwtPayload,envVars.JWT_ACCESS_SECRET,envVars.JWT_ACCESS_EXPIRE)

//     // const refreshToken = generateToken(jwtPayload,envVars.JWT_REFRESH_SECRET,envVars.JWT_REFRESH_EXPIRE)

//     const userTokens=createUserToken(isUserExist)

//     // eslint-disable-next-line @typescript-eslint/no-unused-vars
//     const {password : pass ,...rest} = isUserExist.toObject()
//     return {
//         accessToken :userTokens.accessToken,
//         refreshToken :userTokens.refreshToken,
//         user:rest
//     }
// }
const getNewAccessToken = async(refreshToken : string)=>{
    const newAccessToken= await cerateNewAccessTokenWithRefreshToken(refreshToken)
    return {
        accessToken :newAccessToken
    }
}

const resetPassword = async (payload: Record<string, any>, decodedToken: JwtPayload) => {
    if (payload.id != decodedToken.userId) {
        throw new AppError(401, "You can not reset your password")
    }

    const isUserExist = await User.findById(decodedToken.userId)
    if (!isUserExist) {
        throw new AppError(401, "User does not exist")
    }

    const hashedPassword = await bcryptjs.hash(
        payload.newPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    isUserExist.password = hashedPassword;

    await isUserExist.save()
}
const setPassword = async (userId: string, plainPassword: string) => {
    const user = await User.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    if (user.password && user.auths.some(providerObject => providerObject.provider === "google")) {
        throw new AppError(httpStatus.BAD_REQUEST, "You have already set you password. Now you can change the password from your profile password update")
    }

    const hashedPassword = await bcryptjs.hash(
        plainPassword,
        Number(envVars.BCRYPT_SALT_ROUND)
    )

    const credentialProvider: IAuthProvider = {
        provider: "credentials",
        providerId: user.email
    }

    const auths: IAuthProvider[] = [...user.auths, credentialProvider]

    user.password = hashedPassword

    user.auths = auths

    await user.save()

}
const changePassword = async(oldPassword : string,newPassword : string,decodeToken : JwtPayload)=>{

    const user = await User.findById(decodeToken.userId)

    const isOldPasswordMatched = await bcryptjs.compare(oldPassword,user!.password as string)
    if(!isOldPasswordMatched){
        throw new AppError(httpStatus.BAD_REQUEST,'Old password does not match')
    }

    user!.password = await bcryptjs.hash(newPassword, Number(envVars.BCRYPT_SALT_ROUND))

    user!.save()
}
const forgetPassword = async(email : string)=>{

    const isUserExist = await User.findOne({email})
    if (!isUserExist) {
        throw new AppError(httpStatus.BAD_REQUEST, "User does not exist")
    }
    if (!isUserExist.isVerified) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is not verified")
    }
    if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
        throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
    }
    if (isUserExist.isDeleted) {
        throw new AppError(httpStatus.BAD_REQUEST, "User is deleted")
    }

    const jwtPayload = {
        userId: isUserExist._id,
        email: isUserExist.email,
        role: isUserExist.role
    }

    const resetToken = jwt.sign(jwtPayload, envVars.JWT_ACCESS_SECRET, {
        expiresIn: "10m"
    })

    const resetUILink = `${envVars.FRONTEND_URL}/reset-password?id=${isUserExist._id}&token=${resetToken}`

    sendEmail({
        to: isUserExist.email,
        subject: "Password Reset",
        templateName: "forgetPassword",
        templateData: {
            name: isUserExist.name,
            resetUILink
        }
    })
}

export const AuthServices = {
    // credentialsLogin,
    getNewAccessToken,
    resetPassword,
    changePassword,
    setPassword,
    forgetPassword
}