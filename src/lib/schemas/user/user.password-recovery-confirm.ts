import { z } from 'zod'

const userPasswordRecoveryConfirmSchema = z.object({
  token: z.string().nonempty(),
  newPassword: z.string().min(8, 'Minimo 8 caracteres')
})

export default userPasswordRecoveryConfirmSchema
