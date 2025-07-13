/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express"
import httpStatus from 'http-status-codes'
import { catchAsync } from "../../utils/catchAsync"
import { sendResponse } from "../../utils/sendResponse"
import { AuthServices } from "./auth.service"

const credentialsLogin = catchAsync(async( req: Request, res: Response, next: NextFunction)=>{    
    
        const logInfo =await AuthServices.credentialsLogin(req.body)
        sendResponse(res,{
            statusCode: httpStatus.OK,
            success: true,
            message: 'Users Login successfully',
            data:logInfo,
        })
})


export const AuthControllers = {
    credentialsLogin
}