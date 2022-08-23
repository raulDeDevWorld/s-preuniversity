import Button from '../components/Button'
import PremiumC from '../components/PremiumC'
import { useRouter } from 'next/router'
import PageUserLayout from '../layouts/PageUserLayout'
import { WithAuth } from '../HOCs/WithAuth'
import { useUser } from '../context/Context.js'
import { handleSignOut } from '../firebase/utils.js'
import Subtitle from '../components/Subtitle'
import Error from '../components/Error'
import BlackFont from '../components/BlackFont'
import style from '../styles/Home.module.css'
import { useState, useEffect } from 'react'


function Home() {
    const { setUserAvatar, avatar, user, userDB, success, setUserSuccess } = useUser()
    const router = useRouter()
    function Banco() {
            router.push('/Banco')
    }
    function progress() {
        userDB.profesor == true ? router.push('/Progreso') : router.push('/Progress')
    }
    function play() {
        router.push('/Simulacro')
    }
    function robot() {
        router.push('/Robot')
    }
    useEffect(() => {
        userDB === null ? router.push('/Register') : ''
    }, [userDB]);
    return (
        <>
            <PageUserLayout>
                {userDB === 'loading' && ''}
                {userDB !== null && userDB !== 'loading' &&
                    <div className={style.container}>
                        <div className={style.userDataContainer}>
                            {userDB.premium !== false && <span className={style.subtitle}> Premium</span>}
                            {userDB.premium === false && <span className={style.subtitle}>Demo mode</span>}
                            <img src={`/${userDB.avatar}.png`} className={style.perfil} alt="user photo" />
                            <Subtitle> {'ab1' == userDB.avatar || 'ab2' == userDB.avatar ? 'Bienvenido' : 'Bienvenida'}: <br /> {`${userDB.name.split(' ')[0].toUpperCase()}`}</Subtitle>
                        </div><br />
                        <div className={style.blackButtonsContainer}>
                            <BlackFont>
                                <div className={style.buttonsContainer}>
                                    <Button style='buttonBlackFont' click={play}>Simulacro</Button>
                                    <Button style='buttonBlackFont' click={progress}>Progreso</Button>
                                    <Button style='buttonBlackFont' click={Banco}>Banco de P... <span className={style.pdf}>PDF</span></Button>
                                    <Button style='buttonBlackFont' click={robot}>Test De O.V</Button>
                                </div>
                            </BlackFont>
                        </div><br />
                        <PremiumC></PremiumC>
                    </div>
                }
            </PageUserLayout>
            {success == false && <Error>Elija un avatar</Error>}
        </>
    )
}
export default WithAuth(Home)
