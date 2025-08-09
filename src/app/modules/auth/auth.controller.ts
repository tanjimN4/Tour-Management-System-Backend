/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from 'http-status-codes'
import { JwtPayload } from "jsonwebtoken"
import passport from "passport"
import { envVars } from "../../config/env"
import AppError from "../../errorHelpers/AppError"
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { setAuthCookie } from "../../utils/setCookie"
import { createUserToken } from "../../utils/userTokens"
import { AuthServices } from "./auth.service"

const credentialsLogin = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    // const logInfo = await AuthServices.credentialsLogin(req.body)

    passport.authenticate('local', async (err:any,user: any,info :any) => {

        if (err) {
            // return next(err)
            return next(new AppError(httpStatus.BAD_REQUEST, err.message)   )
        }
        if (!user) {
            return next(new AppError(httpStatus.BAD_REQUEST, info.message)   )
        }

        const userTokens=createUserToken(user)

        // delete user.toObject().password
        const {password,...rest}=user.toObject()
        // const logInfo = createUserToken(user)
        setAuthCookie(res, userTokens)

        sendResponse(res, {
            statusCode: httpStatus.OK,
            success: true,
            message: 'Users Login successfully',
            data: {
                accessToken: userTokens.accessToken,
                refreshToken: userTokens.refreshToken,
                user :rest
            },
        })
    })(req, res, next);
    // res.cookie('accessToken', logInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })

    // res.cookie('refreshToken', logInfo.refreshToken, {
    //     httpOnly: true,
    //     secure: false
    // })


})
const getNewAccessToken = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const refreshToken = req.cookies.refreshToken
    if (!refreshToken) {
        throw new AppError(httpStatus.BAD_REQUEST, 'Refresh token not found')
    }
    const tokenInfo = await AuthServices.getNewAccessToken(refreshToken)

    // res.cookie('accessToken', tokenInfo.accessToken, {
    //     httpOnly: true,
    //     secure: false
    // })
    setAuthCookie(res, tokenInfo)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'New access token Retrieved successfully',
        data: tokenInfo,
    })
})
const logout = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken', {
        httpOnly: true,
        secure: false,
        sameSite: "lax"
    })
    res.clearCookie('refreshToken', {
        httpOnly: true,
        secure: false
    })
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users Logout successfully',
        data: null,
    })
})
const resetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodeToken = req.user
    await AuthServices.resetPassword(req.body, decodeToken as JwtPayload)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users Password Changed successfully',
        data: null,
    })
})
const setPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const decodedToken = req.user as JwtPayload
    const { password } = req.body;

    await AuthServices.setPassword(decodedToken.userId, password);

    sendResponse(res, {
        success: true,
        statusCode: httpStatus.OK,
        message: "Password Changed Successfully",
        data: null,
    })
})
const changePassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    const newPassword = req.body.newPassword
    const oldPassword = req.body.oldPassword
    const decodeToken = req.user
    await AuthServices.changePassword(oldPassword, newPassword, decodeToken as JwtPayload)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Users Password Changed successfully',
        data: null,
    })
})
const forgetPassword = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const {email}=req.body
    await AuthServices.forgetPassword(email)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Email send successfully',
        data: null,
    })
})

const googleCallBackController = catchAsync(async (req: Request, res: Response, next: NextFunction) => {

    let redirectTo = req.query.state ? req.query.state as string : ""
    if (redirectTo.startsWith("/")) {
        redirectTo = redirectTo.slice(1)
    }
    const user = req.user;
    console.log(user);

    if (!user) {
        throw new AppError(httpStatus.BAD_REQUEST, 'User not found')
    }
    const tokenInfo = createUserToken(user)

    setAuthCookie(res, tokenInfo)
    // sendResponse(res, {
    //     statusCode: httpStatus.OK,
    //     success: true,
    //     message: 'Users Password Changed successfully',
    //     data: null,
    // })
    res.redirect(`${envVars.FRONTEND_URL}/${redirectTo}`)
})

export const AuthControllers = {
    credentialsLogin,
    getNewAccessToken,
    logout,
    resetPassword,
    googleCallBackController,
    changePassword,
    setPassword,
    forgetPassword
}