export type RegisterUser = {
  email: string
  username: string
  password: string
  securityQuestion: string
  securityAnswer: string
}


export type CreateUser = RegisterUser & {
  rol: 'comun' | 'admin'
}

export type AuthorizeInput = {
  user: string,
  password: string
}

export type AuthorizedUser = {
  id:number,
  email: string,
  username: string,
  rol: string
}

export type RecoverPassword = {
  email:string,
  securityQuestion: string,
  securityAnswer: string
}

// front-end

export type RegisterUserFront = RegisterUser & {
  password2: string
}

// usuario valido despues de registro exitoso
export type userValid = {
    id: number
    email: string
    username: string
    rol: string,
    pic: string
  }

// cuando editamos el usuario
export type EditUserFront = {
    username?: string,
    securityQuestion?:string,
    securityAnswer?:string,
    password?:string,
    password2?:string
}
