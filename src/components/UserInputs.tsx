import { useError } from "@/context/ErrorContext"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { useState } from "react"

const UserInputs = ({ handleUser, mode }) => {
    const { errors, setErrors } = useError()
    const router = useRouter()
    const [radio, setRadio] = useState<{ action: string }>({ action: "" })


    return (
        <div>
            {mode && mode === 'register' &&
                <div>
                    Email:
                    <input className="input-form" type="text"
                        placeholder='ej: pepe88@gmail.com'
                        name='email'
                        onChange={handleUser}
                    />
                    {errors.email && <p className="error">{errors.email[0]}</p>}
                </div>
            }

            {mode && (mode === 'register' || mode === 'username') &&
                <div>
                    Nombre de usuario:
                    <input className="input-form" type="text"
                        placeholder='pepe88'
                        name='username'
                        onChange={handleUser}
                    />
                    {errors.username && <p className="error">{errors.username[0]}</p>}
                </div>
            }

            {mode && mode === 'login' &&
                <div>
                    Usuario:
                    <input className="input-form" type="text"
                        name='user'
                        onChange={handleUser}
                        placeholder="Ingrese su email o nombre de usuario"
                    />
                    {errors.user && <p className="error">{errors.user[0]}</p>}
                </div>
            }
            {mode && mode === 'password' &&
                <div>
                    <p>Al cambiar su password, automáticamente se cerrará su sesión.</p>
                    Password anterior:
                    <input className="input-form" type="password"
                        name="oldpassword"
                        onChange={handleUser}
                    />
                    {errors.oldpassword && <p className="error">{errors.oldpassword[0]}</p>}
                </div>
            }
            {mode && (mode === 'login' || mode === 'register' || mode === 'delete' || mode === 'password') &&
                <div>
                    Password:
                    <input className="input-form" type="password"
                        name='password'
                        onChange={handleUser}
                    />
                    {errors.password && <p className="error">{errors.password[0]}</p>}
                </div>
            }
            {mode && mode === 'login' &&
                <p className="error">{errors.credentials}</p>
            }

            {mode && (mode === 'register' || mode === 'password') &&
                <div>
                    Confirmar Password:
                    <input className="input-form" type="password"
                        name='password2'
                        onChange={handleUser}
                    />
                    {errors.password2 && <p className="error">{errors.password2[0]}</p>}
                </div>
            }

            {mode && (mode === 'register' || mode === 'security') &&
                <div>
                    {mode && mode === 'security' &&
                        <div>
                            <p>Al cambiar su regunta y/o respuesta de seguridad, automáticamente se cerrará su sesión. </p>

                            <p>Que desea cambiar?</p>

                            Solo Respuesta
                            <input type="radio" name="answer"
                                checked={radio.action === 'answer'}
                                onChange={() => setRadio({ action: 'answer' })}
                            />

                            Pregunta
                            <input type="radio" name="question"
                                checked={radio.action === 'question'}
                                onChange={() => setRadio({ action: 'question' })}
                            />
                        </div>

                    }
                    {mode && (mode === 'register' || (mode === 'security' && radio.action === 'question')) &&
                        <div>
                            {mode === 'security' && radio.action === 'question' &&
                            <p>Si elige pregunta y la envia vacía se dejara la anterior</p>
                            }
                            Seleccione una pregunta
                            < select className="select-form" name="securityQuestion" id="securityQuestion" onChange={handleUser} >
                                <option value=""></option>
                                <option value="Banda Favorita?">Banda Favorita?</option>
                                <option value="Album Favorito?">Album Favorito?</option>
                                <option value="Cancion Favorita?">Cancion Favorita?</option>
                            </select >
                            {errors.securityQuestion && <p className="error">{errors.securityQuestion[0]}</p>}

                        </div>
                    }

                    Respuesta:
                    <input className="input-form" type="text"
                        name='securityAnswer'
                        onChange={handleUser}
                    />
                    {errors.securityAnswer && <p className="error">{errors.securityAnswer[0]}</p>}
                </div>
            }
            {mode && mode === 'register' &&
                <div>
                    Imagen de perfil:
                    <input className="input-form" type="file"
                        name='file' />
                </div>
            }

            <div className='btn-form'>
                {mode && mode === 'register' && <button className="btn" type="submit">Enviar</button>}
                {mode && mode !== 'register' && <button className="btn" type="submit">Enviar</button>}
                {mode && mode === 'register' && <button className="btn" onClick={(e: React.FormEvent) => {
                    e.preventDefault()
                    setErrors({})
                    router.push('/auth/login')
                }}>Volver</button>}
                {mode && mode === 'login' &&
                    <button className="btn" onClick={(e: React.FormEvent) => {
                        e.preventDefault()
                        setErrors({})
                        router.push('/auth/register')
                    }}>Registrarse</button>
                }
                {mode && mode === 'login' &&
                    <Link href={'/password-recovery'}>¿Olvidaste tu contraseña?</Link>
                }
            </div>
        </div >

    )
}

export default UserInputs