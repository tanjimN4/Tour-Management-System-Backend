/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { JwtPayload } from "jsonwebtoken";
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";


const createUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const user = await UserServices.createUser(req.body)
    // res.status(httpStatus.CREATED).json({
    //     message: 'User created successfully',
    //     user
    // })
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User created successfully',
        data: user
    })
})
// const createUser = async(req: Request, res: Response,next:NextFunction) => {
//     try {
//         const user = await UserServices.createUser(req.body)
//         res.status(httpStatus.CREATED).json({
//             message: 'User created successfully',
//             user
//         })
//     } catch (err :any) {
//         console.log(err);
//         next(err)     
//     }
// }
const updateUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.params.id
    // const token = req.headers.authorization
    // const verifiedToken = verifyToken(token as string,envVars.JWT_ACCESS_SECRET) as JwtPayload

    const verifiedToken = req.user
    const payload = req.body

    const user = await UserServices.updateUser(userId, payload, verifiedToken as JwtPayload)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'User updated successfully',
        data: user
    })
})
// c
const getAllUsers = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
      const query = req.query;
    const result = await UserServices.getAllUsers(query as Record<string, string>)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'All Users Retrieved successfully',
        data: result.data,
        meta: result.meta
    })
})
const getMe = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const decodedToken = req.user as JwtPayload
    const result = await UserServices.getMe(decodedToken.userId)
    sendResponse(res, {
        statusCode: httpStatus.CREATED,
        success: true,
        message: 'All Users Retrieved successfully',
        data: result.data,
    })
})
const getSingleUser = catchAsync(async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const result = await UserServices.getSingleUser(id);
    sendResponse(res, {
        success: true,
        statusCode: httpStatus.CREATED,
        message: "User Retrieved Successfully",
        data: result.data
    })
})
export const UserController = {
    createUser,
    getAllUsers,
    updateUser,
    getMe,
    getSingleUser
}