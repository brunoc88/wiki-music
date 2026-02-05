import usernameChangeSchema from "@/lib/schemas/user/user.change.username"
import { EditUserFront } from "@/types/user.types"
import { validateAccion } from "./validateAccion"
import { changeUserName } from "@/lib/auth/api/user.api"

const handleForm = async (data: EditUserFront, mode: string) => {

    console.log('dentro de hanldeform')
    const isValid = validateAccion(data, mode)
    console.log('data', data)
    if (isValid.ok && mode === 'username') return await changeUserName(data)
    
    return {error:isValid.error}
}

export default handleForm