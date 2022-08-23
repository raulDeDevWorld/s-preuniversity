import { useEffect } from 'react'
import Button from '../components/Button'
import Subtitle from '../components/Subtitle'
import PageUserLayout from '../layouts/PageUserLayout'
import { useUser } from '../context/Context.js'
import { userDataRegister } from '../firebase/utils'
import { useRouter } from 'next/router'
import { WithAuth } from '../HOCs/WithAuth'
import style from '../styles/Welcome.module.css'
import Error from '../components/Error'
import BlackFont from '../components/BlackFont'



function Welcome() {
    const { user, avatar, success, setUserSuccess } = useUser()
    const router = useRouter()

    // Registro de un nuevo usuario
    function register(e) {
        e.preventDefault()
        const name = e.target.form[0].value
        const school = e.target.form[1].value
        const cell = e.target.form[2].value


        if (name.length > 2 && school.length > 2 && cell.length > 2) {
            const object = {
                nameGF: user.displayName,
                name,
                school,
                cell,
                avatar,
                premium: false,
                uid: user.uid,
            }
            userDataRegister(object, router, '/Edu/')
        } else {
            setUserSuccess(false)
        }
    }
    function backClick(e) {
        e.preventDefault()
        router.back()
    }

    useEffect(() => {
        avatar == null ? router.push('/Home/') : ''
    }, [avatar,]);
    return (

        <PageUserLayout>
            {success == false && <Error>Llene todo formulario correctamente</Error>}
            {avatar !== null &&
                <div className={style.container}>
                    <div className={style.userDataContainer}>
                        <img src={`/${avatar}.png`} className={style.perfil} alt="avatar" />
                        <Subtitle> Ya casi terminas! <br /> llena el siguiente formulario </Subtitle>
                    </div><br />
                    <div className={style.blackFormContainer}>
                        <BlackFont>
                            <form className={style.formContainer}>
                                <label>
                                    Nombre y apellido:
                                    <input className={style.input} type="text" placeholder='Alex Choque' />
                                </label>
                                <label>
                                    Colegio:
                                    <input className={style.input} type="text" placeholder='Guido Villagomez B' />
                                </label>
                                <label>
                                    Numero De Celular:
                                    <input className={style.input} type="text" placeholder='73447725' />
                                </label>
                                <div className={style.buttonsContainer}>
                                    <Button style='buttonSecondary' click={backClick}>Atras</Button>
                                    <Button style='buttonPrimary' click={register}>Continuar</Button>
                                </div>
                            </form>
                        </BlackFont>
                    </div>
                </div>
            }
        </PageUserLayout>


    )
}

export default WithAuth(Welcome)

