export const registerUser = async (formData: FormData) => {
  const res = await fetch("/api/user", {
    method: "POST",
    body: formData
  })

  const body = await res.json()

  if (!res.ok) {
    return {
      error: body.error ?? "Error del servidor"
    }
  }

  return {
    ok:true,
    user:body.user
  }
}
