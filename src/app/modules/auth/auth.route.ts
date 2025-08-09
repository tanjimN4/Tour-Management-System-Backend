import { NextFunction, Request, Response, Router } from "express";
import passport from "passport";
import { envVars } from "../../config/env";
import { checkAuth } from "../../middlewares/checkAuth";
import { Role } from "../user/user.interface";
import { AuthControllers } from "./auth.controller";

const router = Router();

router.post('/login', AuthControllers.credentialsLogin) 
router.post('/refresh-token', AuthControllers.getNewAccessToken) 
router.post('/logout',AuthControllers.logout)
router.post('/change-password',checkAuth(...Object.values(Role)),AuthControllers.changePassword)
router.post('/set-password',checkAuth(...Object.values(Role)),AuthControllers.setPassword)
router.post('/forgot-password',AuthControllers.forgetPassword)
router.post('/reset-password',checkAuth(...Object.values(Role)),AuthControllers.resetPassword)
router.get('/google',async(req:Request,res :Response,next:NextFunction)=>{
    const redirect = req.query.redirect || "/"
    passport.authenticate('google', { scope: ['email', 'profile'],state:redirect as string })(req, res, next);
})
router.get('/google/callback',passport.authenticate('google', { failureRedirect: `${envVars.FRONTEND_URL}/login?error=true` }),AuthControllers.googleCallBackController)

export const AuthRoutes = router    