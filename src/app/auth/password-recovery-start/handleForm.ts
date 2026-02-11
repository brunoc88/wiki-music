import { validateAccion } from "@/app/user/setting/validateAccion"
import passwordRecoveryStart from "@/lib/auth/api/passwordrecovery.api"

const handleForm = async (data:{ email: string, securityQuestion: string, securityAnswer: string }, mode:string) => {

    const isValid = validateAccion(data, mode)

    
    if(!isValid.ok) {
        return {ok:false, error:isValid.error}
    }

    const res = await passwordRecoveryStart(data)
    if(res.ok) return {ok:true}
    else return {ok:false, error:res.error, status:res.status}
}

export default handleForm