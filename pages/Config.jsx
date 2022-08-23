import PageUserLayout from '../layouts/PageUserLayout'
import { WithAuth } from '../HOCs/WithAuth'
import Button from '../components/Button'
import PremiumC from '../components/PremiumC'
import { useUser } from '../context/Context.js'
import { useState, useEffect } from 'react'
import { progressReset } from '../firebase/utils'
import Error from '../components/Error'
import Success from '../components/Success'
import BlackFont from '../components/BlackFont'

import Modal from '../components/Modal'

import style from '../styles/Config.module.css'
import router from 'next/router'


function Config() {
    const { setUserAvatar, user, userDB, success, setUserSuccess } = useUser()
    const [mode, setMode] = useState(false)

    function avatar() {
        if (userDB.premium === false) {
            setUserSuccess(false)
            return
        }
        router.push('/ConfigAvatar')
    }
    function data() {
        if (userDB.premium === false) {
            setUserSuccess(false)
            return
        }
        router.push('/ConfigPerfil')
    }
    function reset() {
        if (userDB.premium === false) {
            setUserSuccess(false)
            return
        }
        x()
    }
    function configSimulacro() {
        // if (userDB.premium === false){
        //     setUserSuccess(false)
        //     return
        // }
        router.push('/ConfigSimulacro')
    }
    function back() {
        router.back()
    }
    function x() {
        setMode(!mode)
    }
  
    return (
        <>
            <PageUserLayout>
            
                {userDB !== null && userDB !== 'loading' &&
                    <div className={style.container}>
                        <div className={style.userDataContainer}>
                            <span className={style.orange}>Config Mode</span>
                            <img src="/robot.png" className={style.robot} alt="user photo" />
                            <span className={style.message}> {'ab1' == userDB.avatar || 'ab2' == userDB.avatar ? 'Hola,' : 'Bienvenida,'}  {`${userDB.name.split(' ')[0].toUpperCase()}`} personaliza tu cuenta aqui</span>
                        </div><br />
                        <div className={style.buttonsBlackContainer}>
                            <BlackFont>
                                <div className={style.buttonsContainer}>
                                    <Button style='buttonBlackFont' click={avatar}>Avatar</Button>
                                    <Button style='buttonBlackFont' click={data}>Datos de perfil</Button>
                                    <Button style='buttonBlackFont' click={reset}>Resetear progreso </Button>
                                    <Button style='buttonBlackFont' click={configSimulacro}>Play Config</Button>
                                </div>
                            </BlackFont>
                        </div><br />

                        <PremiumC></PremiumC>
                    </div>
                }
            </PageUserLayout>

            {success == true && <Success>Correcto</Success>}
            {success == false && <Error>Hazte Premium para modificar datos</Error>}
        </>
    )
}

export default WithAuth(Config)