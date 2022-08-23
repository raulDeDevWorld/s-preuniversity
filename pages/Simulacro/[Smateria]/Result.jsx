
import { useState, useEffect } from 'react'
import { useUser } from '../../../context/Context.js'
import { setProgress, setErrors, userDataUpdate, getEspecificData } from '../../../firebase/utils'
import { useRouter } from 'next/router'
import BlackFont from '../../../components/BlackFont'
import PageUserLayout from '../../../layouts/PageUserLayout'
import { WithAuth } from '../../../HOCs/WithAuth'
import style from '../../../styles/Result.module.css'

import { CircularProgressBar } from "@tomik23/react-circular-progress-bar";



function Simulacro() {
    const { userDB,  simulacro } = useUser()
    const [select, setSelect] = useState(null)
    const [points, setPoints] = useState(null)
    const [array, setArray] = useState(['a', 'b', 'c', 'd'])

    const router = useRouter()

    function back() {
        router.query.Index > 1
            ? router.back()
            : ''
        setSelect(null)
    }
    function next() {
        router.query.Index < simulacro.length
            ? router.push(`/Simulacro/${router.query.Simulacro}/${parseInt(router.query.Index) + 1}`)
            : ''
        setSelect(null)
    }
    function seeAnswers() {
        router.push(`/Simulacro/${router.query.Smateria}/Answers/1`)
    }
    function nav(i) {

        router.push(`/Simulacro/${router.query.Simulacro}/${parseInt(i) + 1}`)

        setSelect(null)
    }

    //    console.log(simulacro)

    function revision() {
        const data = simulacro.reduce((object, item) => {
            if (item.userAnswer == undefined) {
                const newObject = { undefined: object.undefined + 1 }
                return { ...object, ...newObject }
            }
            const newObject = item.respuesta === item.userAnswer ? { success: object.success + 1 } : { mistakes: object.mistakes + 1 }
            return { ...object, ...newObject }
        }, { success: 0, mistakes: 0, undefined: 0 })
        setPoints(data)
    }


    console.log(points)
    useEffect(() => {
        simulacro !== null ? revision() : ''
    }, []);
    return (
        <PageUserLayout>
            {userDB !== 'loading' &&
                <div className={style.container}>
                    <div>
                        <img src={`/robot.png`} className={style.robot} alt="user photo" />
                    </div>
                    <div className={style.blackContainer}> 
                        <BlackFont>
                            <div className={style.resultContainer}>
                                <p className={`${style.review}`}>
                                    Revisando...
                                </p>
                                <p className={`${style.resulText} ${points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) > 50 ? style.approved : style.reprobate}`}>
                                    {points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) > 50 ? 'Aprobaste 😄' : 'Reprobaste 😅'}
                                </p>

                                {points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) < 51
                                    ? <p className={style.message}>Animo, intentalo otra vez!!! <span className={style.emogi}>😅</span></p>
                                    : ''}
                                {points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) > 50 && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) < 70
                                    ? <p className={style.message}>Bien, vamos x más!!! <span className={style.emogi}>😅</span></p>
                                    : ''}
                                {points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) > 69 && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) < 85
                                    ? <p className={style.message}>Muy Bien, buen progreso!!! <span className={style.emogi}>😀</span></p>
                                    : ''}
                                {points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) > 84 && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) < 100
                                    ? <p className={style.message}>Exelente, vamos super!!! <span className={style.emogi}>😃</span></p>
                                    : ''}
                                {points !== null && Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) == 100
                                    ? <p className={style.perfectMessage}>Perfectooo, felicidades!!! <span className={style.emogi}>😍</span></p>
                                    : ''}
                                <CircularProgressBar
                                    colorCircle="#365b74"
                                    fontColor="#00F0FF"
                                    size= {150}
                                    fontSize="20px"
                                    unit="pts"
                                    linearGradient={[
                                        '#8ff8ff',
                                        '#00F0FF',
                                    ]}
                                    percent={points !== null ? Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined)) : 0}
                                    round
                                />
                                {points !== null && <div className={style.detailResultContainer}>
                                    <div className={`${style.detailText} ${style.materia}`}> Materia: {router.query.Simulacro}</div>
                                    <div className={`${style.detailText} ${style.errores}`}> Errores: {points.mistakes} / {points.success + points.mistakes + points.undefined}
                                        <div className={style.progressBarPorcent}>
                                            <div className={style.porcentErrors} style={{ width: `${Math.round(points.mistakes * 100 / (points.success + points.mistakes + points.undefined))}%` }}>
                                            </div>
                                        </div>
                                    </div>
                                    <div className={`${style.detailText} ${style.aciertos}`}> Aciertos: {points.success} / {points.success + points.mistakes + points.undefined}
                                        <div className={style.progressBarPorcent}>
                                            <div className={style.porcentSuccess} style={{ width: `${Math.round(points.success * 100 / (points.success + points.mistakes + points.undefined))}%` }}></div>
                                        </div>
                                    </div>
                                    <div className={`${style.detailText} ${style.noRes}`}> No respondidos: {points.undefined} / {points.success + points.mistakes + points.undefined}
                                        <div className={style.progressBarPorcent}>
                                            <div className={style.porcentUndefined} style={{ width: `${Math.round(points.undefined * 100 / (points.success + points.mistakes + points.undefined))}%` }}></div>
                                        </div>
                                    </div>
                                </div>}
                                <p className={`${style.detailText} ${style.verRes}`} onClick={seeAnswers}>Ver respuestas</p>
                            </div>
                        </BlackFont>
                    </div>
                </div>
            }
        </PageUserLayout>
    )
}
export default WithAuth(Simulacro)











{/* <ChangingProgressProvider values={[0, 80]}>
                                        {(percentage) => (
                                            <CircularProgressbar
                                                value={percentage}
                                                text={`${percentage}%`}
                                                styles={buildStyles({
                                                    pathTransition:
                                                        percentage === 0 ? "none" : "stroke-dashoffset 0.5s ease 0s",
                                                        pathColor: `#00F0FF`,
                                                        textColor: '#00F0FF',
                                                        trailColor: '#d6d6d6',
                                                })}
                                            />
                                        )}
                                    </ChangingProgressProvider> */}



 {/* <ChangingProgressProvider values={[0, 80]}>
                                    {(percentage) => (
                                            <CircularProgressbarWithChildren
                                                value={percentage}
                                                text={`${percentage}%`}
                                                strokeWidth={10}
                                                styles={buildStyles({
                                                    strokeLinecap: "butt",
                                                    pathTransition:
                                                        percentage === 0 ? "none" : "stroke-dashoffset 0.5s linear 0s "
                                                })}
                                            >
                                                <RadialSeparators
                                                    count={12}
                                                    style={{
                                                        background: "black",
                                                        width: "2px",
                                                        // This needs to be equal to props.strokeWidth
                                                        height: `${10}%`
                                                    }}
                                                />
                                            </CircularProgressbarWithChildren>
                                    )}
                                </ChangingProgressProvider>  */}