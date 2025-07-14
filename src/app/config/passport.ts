import passport from "passport";
import { Strategy as GoogleStrategy, Profile, VerifyCallback } from "passport-google-oauth20";
import { Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
import { envVars } from "./env";


passport.use(new GoogleStrategy(
    {
        clientID: envVars.GOOGLE_CLIENT_ID,
        clientSecret: envVars.GOOGLE_CLIENT_SECRET,
        callbackURL: envVars.GOOGLE_CALLBACK_URL
    }, async (accessToken: string, refreshToken: string, profile: Profile, done: VerifyCallback) => {
        try {
            const email = profile.emails?.[0].value;

            if (!email) {
                return done(null, false, { message: "NO Email found" });
            }

            let user = await User.findOne({ email });
            if (!user) {
                user = await User.create({
                    email,
                    name: profile.displayName,
                    picture: profile.photos?.[0].value,
                    role: Role.USER,
                    auths: [{ provider: "google", providerId: profile.id }],
                    isVerified: true
                });
            }

            return done(null, user);
        } catch (error) {
            console.log("Google Strategy Error", error);
            return done(error);

        }
    }
));

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.serializeUser((user: any, done: (err: any, id?: unknown)=>void) => {
    done(null, user._id);
});

// eslint-disable-next-line @typescript-eslint/no-explicit-any
passport.deserializeUser(async (id: string, done: (err: any, user?: any)=>void) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (error) {
        done(error);
    }
});