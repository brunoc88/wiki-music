import { loginUser } from "@/lib/auth/api/login.api";
import LoginSchema from "@/lib/schemas/login.schema";
import { AuthorizeInput } from "@/types/user.types";

export const handleLogin = async (data: AuthorizeInput) => {
    const parsed = await LoginSchema.safeParseAsync(data)
    if (!parsed.success) return {error: parsed.error.flatten().fieldErrors}

    const res = await loginUser(data)
    if (res?.error) {
    return {
      error: {credentials:'crendenciales invalidas'}
    }
  }
    return {ok:true}
    
}