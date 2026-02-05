import usernameChangeSchema from "@/lib/schemas/user/user.change.username"
import { EditUserFront } from "@/types/user.types"
import { validateAccion } from "./validateAccion"
import { changeUserName, deleteAccount } from "@/lib/auth/api/user.api"

const handleForm = async (data: EditUserFront, mode: string) => {

    const isValid = validateAccion(data, mode)
    
    if (isValid.ok && mode === 'username') return await changeUserName(data)
    if (isValid.ok && mode === 'delete') return await deleteAccount(data)
    
    return {error:isValid.error}
}

export default handleForm