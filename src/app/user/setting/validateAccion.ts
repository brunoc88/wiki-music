import usernameChangeSchema from "@/lib/schemas/user/user.change.username"
import userDeleteAccountSchema from "@/lib/schemas/user/user.deleteAccount.schema"
import ChangePasswordSchema from "@/lib/schemas/user/user.editpassword.schema"
import { EditUserFront } from "@/types/user.types"

export const validateAccion = (data:EditUserFront, mode:string) => {
    
    let parsed

    if(mode === 'username') {
        parsed = usernameChangeSchema.safeParse(data)
    }

    if(mode === 'delete') {
        parsed = userDeleteAccountSchema.safeParse(data)
    }

    if(mode === 'password') {
        parsed = ChangePasswordSchema.safeParse(data)
    }

    if(parsed && !parsed?.success) return {
        ok:false,
        error: parsed?.error.flatten().fieldErrors
    } 

    return {ok:true}

}