import z from "zod";
import { IsActive, Role } from "./user.interface";

export const createUserZodSchema = z.object({
            name: z
                .string({ invalid_type_error: 'Name must be a string' })
                .min(2, { message: 'Name must be at least 2 characters long' })
                .max(50, { message: 'Name must be at most 50 characters long' }),
            email: z
                .string({ invalid_type_error: 'Email must be a string' })
                .email({ message: 'Email must be a valid email address' })
                .min(5, { message: 'Email must be at least 5 characters long' })
                .max(100, { message: 'Email must be at most 100 characters long' }),
            password: z
                .string({ invalid_type_error: "Password must be a string" })
                .min(8, { message: "Password must be at least 8 characters long" })
                .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
                .regex(/\d/, { message: "Password must contain at least one number" })
                .regex(/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/, {
                    message: "Password must contain at least one special character"
                }),
            phone: z
                .string({ invalid_type_error: 'Phone must be a string' })
                .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, {
                    message: 'Phone number must be a valid Bangladeshi number',
                })
                .optional(),
            address: z
                .string({ invalid_type_error: 'Address must be a string' })
                .max(200, { message: 'Address must be at most 200 characters long' })
                .optional(),
})
export const updateUserZodSchema = z.object({
            name: z
                .string({ invalid_type_error: 'Name must be a string' })
                .min(2, { message: 'Name must be at least 2 characters long' })
                .max(50, { message: 'Name must be at most 50 characters long' })
                .optional(),
            phone: z
                .string({ invalid_type_error: 'Phone must be a string' })
                .regex(/^(?:\+8801|8801|01)[3-9]\d{8}$/, {
                    message: 'Phone number must be a valid Bangladeshi number',
                })
                .optional(),
            role: z
                .enum(Object.keys(Role) as [string])
                .optional(),
                isActive:z
                .enum(Object.values(IsActive) as [string])
                .optional(),
            isDeleted:z
            .boolean({invalid_type_error:"isDeleted must be a true or false"})
            .optional(),
            isVerified:z
                .boolean({invalid_type_error:"isVerified must be a true or false"})
                .optional(),
            address: z
                .string({ invalid_type_error: 'Address must be a string' })
                .max(200, { message: 'Address must be at most 200 characters long' })
                .optional(),
})