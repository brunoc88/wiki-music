import { userValid } from "@/types/user.types"

export const registerUser = async (formData: FormData) => {
  const res = await fetch("/api/user", {
    method: "POST",
    body: formData
  })

  const body = await res.json()

  if (!res.ok) {
    return {
      ok: false,
      error: body.error ?? "Error del servidor"
    }
  }


  let user: userValid = body.user

  return {
    ok: true,
    user
  }
}
