/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import httpStatus from 'http-status-codes';
import { catchAsync } from "../../utils/catchAsync";
import { sendResponse } from "../../utils/sendResponse";
import { UserServices } from "./user.service";


const createUser = catchAsync(async(req: Request, res: Response, next: NextFunction)=>{
    const user = await UserServices.createUser(req.body)
        // res.status(httpStatus.CREATED).json({
        //     message: 'User created successfully',
        //     user
        // })
        sendResponse(res,{
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'User created successfully',
            data:user
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

const getAllUsers =catchAsync(async( req: Request, res: Response, next: NextFunction)=>{    
        const result = await UserServices.getAllUser()
        sendResponse(res,{
            statusCode: httpStatus.CREATED,
            success: true,
            message: 'All Users Retrieved successfully',
            data:result.data,
            meta:result.meta
        })
})
export const UserController = {
    createUser,
    getAllUsers
}