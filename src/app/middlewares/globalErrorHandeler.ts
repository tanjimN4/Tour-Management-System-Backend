/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextFunction, Request, Response } from "express";
import { deleteImageFromCloudinary } from "../config/cloudinary.config";
import { envVars } from "../config/env";
import AppError from "../errorHelpers/AppError";
import { handelValidationError } from "../helpers/handelValidationError";
import { handelZodError } from "../helpers/handelZodError";
import { handleCastError } from "../helpers/handleCastError";
import { handleDuplicateError } from "../helpers/handleDuplicateError";
import { TErrorSources } from "../interfaces/error.types";

export const globalErrorHandler = async (err: any, req: Request, res: Response, next: NextFunction) => {
    if (envVars.NODE_ENV === 'development') {
        console.log(err);
    }
    if(req.file){
        await deleteImageFromCloudinary(req.file.path)
    }
    if(req.files && Array.isArray(req.files) && req.files.length > 0){
        const imageUrls = (req.files as Express.Multer.File[]).map(file=>file.path)
        await Promise.all(imageUrls.map(url=>deleteImageFromCloudinary(url)))
    }
    let statusCode = 500;
    let message = `something went wrong !!`;

    let errorSources: TErrorSources[] = []

    //object id  error/cast error
    if (err.code === 11000) {
        const simplifiedError = handleDuplicateError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message

    }
    else if (err.name === "ZodError") {
        const simplifiedError = handelZodError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    //mongoose validation error
    else if (err.name === 'CastError') {
        const simplifiedError = handleCastError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
    }
    else if (err.name === 'ValidationError') {
        const simplifiedError = handelValidationError(err)
        statusCode = simplifiedError.statusCode
        message = simplifiedError.message
        errorSources = simplifiedError.errorSources as TErrorSources[]
    }
    else if (err instanceof AppError) {
        statusCode = err.statusCode
        message = err.message
    } else if (err instanceof Error) {
        statusCode = 500
        message = err.message
    }
    res.status(statusCode).json({
        success: false,
        message,
        errorSources,
        err : envVars.NODE_ENV === 'development' ? err : null,
        stack: envVars.NODE_ENV === 'development' ? err.stack : null
    })
}