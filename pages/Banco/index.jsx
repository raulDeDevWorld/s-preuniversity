import Button from '../../components/Button'
import PremiumC from '../../components/PremiumC'
import { useRouter } from 'next/router'
import PageUserLayout from '../../layouts/PageUserLayout'
import { WithAuth } from '../../HOCs/WithAuth'
import { useUser } from '../../context/Context.js'
import { manageSimulacro } from '../../firebase/utils'
import Subtitle from '../../components/Subtitle'
import BlackFont from '../../components/BlackFont'
import Link from 'next/link'
import style from '../../styles/Home.module.css'



function Play() {
    const { userDB, setUserSimulacro, simulacro } = useUser()

    const router = useRouter()

    // function next(materia) {
    //     manageSimulacro(materia, userDB.university, setUserSimulacro)
    //     router.push('/Simulacro')
    // }

    return (
        <>
            <PageUserLayout>
                {userDB === 'loading' && ''}

                {userDB !== null && userDB !== 'loading' &&
                    <div className={style.container}>
                        <div className={style.userDataContainer}>
                            {userDB.premium !== false && <span className={style.subtitle}> Premium</span>}
                            {userDB.premium === false && <span className={style.subtitle}>Free mode</span>}
                            <img src={`/${userDB.avatar}.png`} className={style.perfil} alt="user photo" />
                            <Subtitle> {'ab1' == userDB.avatar || 'ab2' == userDB.avatar ? 'Bienvenido' : 'Bienvenida'}: <br /> {`${userDB.name.split(' ')[0].toUpperCase()}`}</Subtitle>
                        </div><br />
                        <div className={style.blackButtonsContainer}>
                            <BlackFont>
                                <div className={style.buttonsContainer}>
                                    {Object.keys(userDB.subjects).map((m, i) =>
                   
                                            <Link href={`Banco/${m.charAt(0).toUpperCase() + m.slice(1)}`} key={i} >
                                                <a className={style.link}>
                                                    <Button style='buttonBlackFont'>{m.charAt(0).toUpperCase() + m.slice(1)}</Button>
                                                </a>
                                            </Link>
                                     
                                        
                                    )}
                                </div>

                            </BlackFont>
                        </div><br />
                        <PremiumC></PremiumC>
                    </div>
                }

            </PageUserLayout>
        </>
    )
}

export default WithAuth(Play)
