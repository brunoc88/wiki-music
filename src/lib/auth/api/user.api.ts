import { EditUserFront, userValid } from "@/types/user.types"

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

export const changeUserName = async (data: EditUserFront) => {
  console.log('dentro de changeusername')
  const res = await fetch('/api/user', {
    method: 'PATCH',
    body: JSON.stringify(data)
  })

  const body = await res.json()

  if(res.ok) return {ok:true, username: body.username}
  else return {ok: false, error:body.error?? "Error del servidor"}
}

export const deleteAccount = async (data: EditUserFront) => {
  const res = await fetch('/api/user', {
    method:'DELETE',
    body:JSON.stringify(data)
  })

  const body = await res.json()

  console.log('body',body)
  if(res.ok) {
    return {ok:true}
  }else {
    return {ok:false, error:{password:[body.error?? "Error del servidor"]}}
  }

}