import { NextFunction, Request, Response } from "express"
import httpStatus from "http-status-codes"
import { JwtPayload } from "jsonwebtoken"
import { envVars } from "../config/env"
import AppError from "../errorHelpers/AppError"
import { IsActive } from "../modules/user/user.interface"
import User from "../modules/user/user.model"
import { verifyToken } from "../utils/jwt"

export const checkAuth = (...authRoles: string[]) => async (req: Request, res: Response, next: NextFunction) => {
    try {
        const accessToken = req.headers.authorization
        if (!accessToken) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'Access token not found')
        }
        const verifiedToken = verifyToken(accessToken, envVars.JWT_ACCESS_SECRET) as JwtPayload

        const isUserExist = await User.findOne({ email: verifiedToken.email })

        if (!isUserExist) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User does not exist')
        }
        if (isUserExist.isActive === IsActive.BLOCKED || isUserExist.isActive === IsActive.INACTIVE) {
            throw new AppError(httpStatus.BAD_REQUEST, `User is ${isUserExist.isActive}`)
        }
        if (isUserExist.isDeleted) {
            throw new AppError(httpStatus.BAD_REQUEST, 'User is deleted')
        }

        if (!authRoles.includes(verifiedToken.role)) {
            throw new AppError(httpStatus.UNAUTHORIZED, 'You are not permitted to view this ..........route')
        }
        req.user = verifiedToken
        next()
    } catch (error) {
        next(error)
    }
}
