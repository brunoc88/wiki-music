const passwordRecoveryStart = async (data: { email: string, securityQuestion: string, securityAnswer: string }) => {
    const res = await fetch('/api/user/password-recovery/start', {
        method: 'POST',
        body: JSON.stringify(data)
    })
    
    const body = await res.json()
    
    if (res.ok) return { ok: true }
    else return { ok: false, error:body.error, status:res.status }
}

export const passwordRecoveryConfirm = async (data:{newPassword:string, token:string|null})=> {
    const res = await fetch('/api/user/password-recovery/confirm', {
        method:'POST',
        body:JSON.stringify(data)
    })

    const body = await res.json()

    if(res.ok) return {ok:true}
    else return {ok:false, status:res.status, error:body.error}
}



export default passwordRecoveryStart

