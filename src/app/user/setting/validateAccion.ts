import usernameChangeSchema from "@/lib/schemas/user/user.change.username"
import { EditUserFront } from "@/types/user.types"

export const validateAccion = (data:EditUserFront, mode:string) => {
    console.log('dentro de validateAccion')
    let parsed

    if(mode === 'username') {
        parsed = usernameChangeSchema.safeParse(data)
    }

    if(parsed && !parsed?.success) return {
        ok:false,
        error: parsed?.error.flatten().fieldErrors
    } 

    return {ok:true}

}