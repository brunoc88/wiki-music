export type RegisterUser = {
  email:string,
  username:string,
  password: string,
  securityQuestion:string,
  securityAnswer:string,
  pic?:string
}

export type CreateUser =  RegisterUser & {
  rol: 'comun' | 'admin'
}
