import { useError } from "@/context/ErrorContext"

const UserInputs = ({ handleUser, mode }) => {
    const { errors } = useError()
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

            {mode && mode === 'register' &&
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
                        placeholder="Ingrese su eamil o nombre de usuario"
                    />
                    {errors.user && <p className="error">{errors.user[0]}</p>}
                </div>
            }
            {mode && (mode === 'login' || mode === 'register') &&
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
            
            {mode && mode === 'register' &&
                <div>
                    Confirmar Password:
                    <input className="input-form" type="password"
                        name='password2'
                        onChange={handleUser}
                    />
                    {errors.password2 && <p className="error">{errors.password2[0]}</p>}
                </div>
            }

            {mode && mode === 'register' &&
                <div>
                    Seleccione una pregunta
                    < select className="select-form" name="securityQuestion" id="securityQuestion" onChange={handleUser} >
                        <option value=""></option>
                        <option value="Banda Favorita?">Banda Favorita?</option>
                        <option value="Album Favorito?">Album Favorito?</option>
                        <option value="Cancion Favorita?">Cancion Favorita?</option>
                    </select >
                    {errors.securityQuestion && <p className="error">{errors.securityQuestion[0]}</p>}
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
                <button className="btn" type="submit">Enviar</button>
                <button className="btn">Volver</button>
            </div>
        </div >
    )
}

export default UserInputs