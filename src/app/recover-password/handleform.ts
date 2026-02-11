import { passwordRecoveryConfirm } from "@/lib/auth/api/passwordrecovery.api"
import { validateAccion } from "../user/setting/validateAccion"

const handleForm = async (data:any, mode:string) => {
    const isValid = validateAccion(data, mode)

    if(!isValid.ok) return {ok:false, error:isValid.error}
    
    const res = await passwordRecoveryConfirm (data)
    if(res.ok) return {ok:true}
    else return {ok:false, error:res.error}

}

export default handleForm