import bcryptjs from "bcryptjs";
import { envVars } from "../config/env";
import { IAuthProvider, IUser, Role } from "../modules/user/user.interface";
import User from "../modules/user/user.model";
export const seedSuperAdmin = async () => {
    try {
        const isSuperAdminExist = await User.findOne({email:envVars.SUPER_ADMIN_EMAIL})

        if(isSuperAdminExist){
            console.log("Super admin already exist");
            return   
        }
        console.log("Trying to create super admin");
        

        const hashedPassword = await bcryptjs.hash(envVars.SUPER_ADMIN_PASSWORD as string,Number(envVars.BCRYPT_SALT_ROUND))

        const authProvider : IAuthProvider={
            provider:"credentials",
            providerId:envVars.SUPER_ADMIN_EMAIL as string
        }

        const payload :IUser ={
            name:'Super admin',
            role:Role.SUPER_ADMIN,
            email:envVars.SUPER_ADMIN_EMAIL,
            isVerified:true,
            auths:[authProvider],
            password:hashedPassword
        }

        const superAdmin = await User.create(payload)
        console.log("Super admin created successfully");
        console.log(superAdmin);
        
    } catch (error) {
        console.log(error);
        
    }
}