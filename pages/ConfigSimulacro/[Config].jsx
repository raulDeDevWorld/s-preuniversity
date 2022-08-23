import Button from '../../components/Button'
import Subtitle from '../../components/Subtitle'
import { useState, useEffect } from 'react'
import PageSimulacroLayout from '../../layouts/PageSimulacroLayout'
import { useUser } from '../../context/Context.js'
import { userDataUpdate, updateBank, getAllBank } from '../../firebase/utils'
import { useRouter } from 'next/router'
import { WithAuth } from '../../HOCs/WithAuth'
import Error from '../../components/Error'
import Success from '../../components/Success'
import style from '../../styles/PlayConfig.module.css'
import BlackFont from '../../components/BlackFont'
import PremiumC from '../../components/PremiumC'
import { set } from 'lodash'

function PlayConfig() {
    const { userDB, setUserData,setUserSuccess, success, bank, setUserBank } = useUser()
    const [arrF, setArrF] = useState(null)
    const [arrR, setArrR] = useState(null)
    const [arrD, setArrD] = useState(null)
    const [time, setTime] = useState(null)
    const [questions, setQuestions] = useState(null)
    const [difficulty, setDifficulty] = useState(null)

    const router = useRouter()


    function back() {
        router.back()
    }  
    function save () {
        const newTime = time == null ? userDB.subjects[router.query.Config.toLowerCase()].config.time : time
        const newQuestions = questions == null ? userDB.subjects[router.query.Config.toLowerCase()].config.questions : questions
        const newDifficulty = difficulty == null ? userDB.subjects[router.query.Config.toLowerCase()].config.difficulty : difficulty

        if(newDifficulty == 'facil' && arrF.length < newQuestions){
            setUserSuccess('insuficiente')
            return
        }
        if(newDifficulty == 'regular' && arrF.length < newQuestions){
            setUserSuccess('insuficiente')
            return
        }
        if(newDifficulty == 'dificil' && arrF.length < newQuestions){
            setUserSuccess('insuficiente')
            return
        }
        const object = {
            config: {
                time: newTime,
                questions: newQuestions,
                difficulty: newDifficulty,
            }
        }
        userDataUpdate(object, setUserData, router.query.Config, setUserSuccess)
        setTime(null)
        setQuestions(null)
        setDifficulty(null)
    }
    async function progressHandler () {
        const progressObj = await userDB.subjects[router.query.Config.toLowerCase()].progress
        const arrProgressObj = Object.values(progressObj)

        const arrF = arrProgressObj.filter(item => item.difficulty == 'F')
        const arrR = arrProgressObj.filter(item => item.difficulty == 'R')
        const arrD = arrProgressObj.filter(item => item.difficulty == 'D')

        setArrF(arrF)
        setArrR(arrR)
        setArrD(arrD)
    }
    
    useEffect(() => {
        if (userDB.university) {
            if (bank) {
                bank[router.query.Config.toLowerCase()] ? console.log('exist') : console.log('no exist')
            } else {
                getAllBank(userDB.university, userDB.subjects, setUserBank)   
            }
            progressHandler()
        }
    }, [userDB.university, bank])
    return (
        <PageSimulacroLayout>
            {success == 'save' && <Success>Guardado</Success>}
            {success == 'insuficiente' && <Error>Cantidad de preguntas insuficientes</Error>}
            
            {userDB !== null && userDB !== 'loading' && bank && bank[router.query.Config.toLowerCase()] &&
                <div className={style.container}>
                    <div className={style.userDataContainer}>
                        <span className={style.config}>Config mode</span>
                        <img src={`/robot.png`} className={style.robot} alt="user photo" />
                    </div><br />
                    <div className={style.configBlackContainer}>
                        <BlackFont>
                            <div className={style.configContainer}>
                                <span className={style.materia}>{router.query.Config.toUpperCase()}</span>
                                <div className={style.message}>Tiempo</div>
                                <div className={style.containerBoxSelect}>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.time == 5 ? style.boxSelectNow : ''} ${time == 5 ? style.green : ''}`} onClick={() => setTime(5)}>5</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.time == 10 ? style.boxSelectNow : ''} ${time == 10 ? style.green : ''}`} onClick={() => setTime(10)}>10</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.time == 15 ? style.boxSelectNow : ''} ${time == 15 ? style.green : ''}`} onClick={() => setTime(15)}>15</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.time == 30 ? style.boxSelectNow : ''} ${time == 30 ? style.green : ''}`} onClick={() => setTime(30)}>30</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.time == 60 ? style.boxSelectNow : ''} ${time == 60 ? style.green : ''}`} onClick={() => setTime(60)}>60</div>
                                </div>
                                <div className={style.message}>Cantidad de preguntas</div>
                                <div className={style.containerBoxSelect}>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.questions == 5 ? style.boxSelectNow : ''} ${questions == 5 ? style.green : ''}`} onClick={() => setQuestions(5)}>5</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.questions == 10 ? style.boxSelectNow : ''} ${questions == 10 ? style.green : ''}`} onClick={() => setQuestions(10)}>10</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.questions == 15 ? style.boxSelectNow : ''} ${questions == 15 ? style.green : ''}`} onClick={() => setQuestions(15)}>15</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.questions == 30 ? style.boxSelectNow : ''} ${questions == 30 ? style.green : ''}`} onClick={() => setQuestions(30)}>30</div>
                                    <div className={`${style.boxSelect} ${userDB.subjects[router.query.Config.toLowerCase()].config.questions == 60 ? style.boxSelectNow : ''} ${questions == 60 ? style.green : ''}`} onClick={() => setQuestions(60)}>60</div>
                                </div>
                                <div className={style.message}>Dificultad</div>
                                <div className={style.buttonsContainer}>
                                    <button className={`${style.button} ${userDB.subjects[router.query.Config.toLowerCase()].config.difficulty == 'facil' ? style.boxSelectNow : ''} ${difficulty == 'facil' ? style.green : ''}`} onClick={() => setDifficulty('facil')}>Facil</button>
                                    <div className={style.boxSelect}>{arrF && arrF.length}p</div>
                                </div>
                                <div className={style.buttonsContainer}>
                                    <button className={`${style.button} ${userDB.subjects[router.query.Config.toLowerCase()].config.difficulty == 'regular' ? style.boxSelectNow : ''} ${difficulty == 'regular' ? style.green : ''}`} onClick={() => setDifficulty('regular')}>Regular</button>
                                    <div className={style.boxSelect}>{arrR && arrR.length}p</div>
                                </div>
                                <div className={style.buttonsContainer}>
                                    <button className={`${style.button} ${userDB.subjects[router.query.Config.toLowerCase()].config.difficulty == 'dificil' ? style.boxSelectNow : ''} ${difficulty == 'dificil' ? style.green : ''}`} onClick={() => setDifficulty('dificil')}>Dificil</button>
                                    <div className={style.boxSelect}>{arrD && arrD.length}p</div>
                                </div>
                                <div className={style.buttonsContainer}>
                                    <button className={`${style.button} ${userDB.subjects[router.query.Config.toLowerCase()].config.difficulty == 'aleatorio' ? style.boxSelectNow : ''} ${difficulty == 'aleatorio' ? style.green : ''}`} onClick={() => setDifficulty('aleatorio')}>Aleatorio</button>
                                    <div className={style.boxSelect}>{bank[router.query.Config.toLowerCase()].length}p</div>
                                </div>
                                <Button style='successButton' click={save}>Finalizar</Button>
                            </div>
                        </BlackFont>
                    </div><br />
                    <PremiumC></PremiumC>
                </div>
            }
        </PageSimulacroLayout>
    )
}
export default WithAuth(PlayConfig)