import { registerUser } from "@/lib/auth/api/user.api"
import userSchema from "@/lib/schemas/user/user.schema"


export const handleForm = async (formData: FormData) => {
  const data = {
    email: formData.get("email")?.toString() || "",
    username: formData.get("username")?.toString() || "",
    password: formData.get("password")?.toString() || "",
    password2: formData.get("password2")?.toString() || "",
    securityQuestion: formData.get("securityQuestion")?.toString() || "",
    securityAnswer: formData.get("securityAnswer")?.toString() || ""
  }

  const parsed = userSchema.safeParse(data)

  if (!parsed.success) {
    return {
      error: parsed.error.flatten().fieldErrors
    }
  }
 
  const res = await registerUser(formData)
  return res
}
