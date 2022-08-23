import { useRouter } from 'next/router'
import style from '../styles/PremiumC.module.css'
import { useUser } from '../context/Context.js'
import BlackFont from '../components/BlackFont'

function PremiumC() {

    const {  userDB } = useUser()
    const router = useRouter()
    function next () {
        router.pathname !== '/Premium' ? router.push('/Premium'): router.push("https://api.whatsapp.com/send?phone=+59173447725&text=Buenas,%20me%20gustaria%20adquirir%20Swoou%20Premium%20%20")
    }  
    return (
        <div className={style.container} onClick={next}>
            <BlackFont>
                <div className={style.dataContainer}>
                    <span className={style.title}>Swoou Premium</span>
                    <div className={style.message}>
                        <span className={style.textOne}>{(`${userDB.premium}`).length > 16 ? 'Felicidades!!!' : ''}{userDB.premium === false ? 'hazlo simple' : ''}</span>
                        <span className={style.textTwo}>{(`${userDB.premium}`).length > 16 ? 'Eres PREMIUM' : ''}{userDB.premium === false ? 'hazte premium' : ''}</span>
                    </div>
                </div>
            </BlackFont>


        </div>
    )
}
export default PremiumC
