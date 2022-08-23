import Button from '../components/Button'
import PremiumC from '../components/PremiumC'
import { useRouter } from 'next/router'
import PageUserLayout from '../layouts/PageUserLayout'
import { WithAuth } from '../HOCs/WithAuth'
import { useUser } from '../context/Context.js'
import { handleSignOut } from '../firebase/utils.js'
import Subtitle from '../components/Subtitle'
import Error from '../components/Error'
import Paragraph from '../components/Paragraph'
import BlackFont from '../components/BlackFont'

import style from '../styles/Register.module.css'
import { useState } from 'react'


function Register() {
    const { setUserAvatar, avatar, user, userDB, success, setUserSuccess } = useUser()
    const router = useRouter()

    function avatarClick(a) {
        setUserAvatar(a)
    }
    function nextClick() {
        avatar !== null ? router.push('/Welcome') : setUserSuccess(false)
    }
    function backOut() {
        handleSignOut()
    }

    return (
        <PageUserLayout>
            {success == false && <Error>Elija un avatar</Error>}
            <div className={style.container}>
                <img src={user.photoURL} className={style.perfil} alt="user photo" /><br />
                <Subtitle> Bienvenido (a): <br /> {`${user.displayName.toUpperCase()}`}</Subtitle>
                <Paragraph>Elige tu avatar</Paragraph> <br />
                <div className={style.blackFormContainer}>
                    <BlackFont>
                        <div className={style.formContainer}>
                            <div className={style.avatarsContainer}>
                                <img src="/ab1.png" alt="avatar" className={`${style.avatarb1} ${avatar == 'ab1' ? style.right : ''}`} onClick={(e) => { avatarClick('ab1') }} />
                                <img src="/ab2.png" alt="avatar" className={`${style.avatarb2} ${avatar == 'ab2' ? style.right : ''}`} onClick={(e) => { avatarClick('ab2') }} />
                                <img src="/ag3.png" alt="avatar" className={`${style.avatarg1} ${avatar == 'ag3' ? style.right : ''}`} onClick={(e) => { avatarClick('ag3') }} />
                                <img src="/ag2.png" alt="avatar" className={`${style.avatarg2} ${avatar == 'ag2' ? style.right : ''}`} onClick={(e) => { avatarClick('ag2') }} />
                            </div><br />
                            <div className={style.buttonsContainer}>
                                <Button style='buttonSecondary' click={backOut}>Atras</Button>
                                <Button style='buttonPrimary' click={nextClick}>Continuar</Button>
                            </div>
                        </div>
                    </BlackFont>
                </div>
            </div>
        </PageUserLayout>
    )
}

export default WithAuth(Register)