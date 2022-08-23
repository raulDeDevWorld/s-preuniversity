
import { useState, useEffect } from 'react'
import { useUser } from '../../../../context/Context.js'
import { setProgress, setErrors, userDataUpdate, getEspecificData } from '../../../../firebase/utils'
import { useRouter } from 'next/router'
import Error from '../../../../components/Error'
import Success from '../../../../components/Success'

import PageSimulacro from '../../../../layouts/PageSimulacro'
import { WithAuth } from '../../../../HOCs/WithAuth'
import style from '../../../../styles/Smateria.module.css'


function Simulacro() {
    const { userDB, setUserSuccess, success, setUserData, simulacro, setUserSimulacro, bank, setUserBank, fisherArray } = useUser()
    const [select, setSelect] = useState(null)
    const [count, setCount] = useState(0)

    const router = useRouter()

    function fisherYatesShuffle(arr) {
        for (var i = arr.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1)); //random index
            [arr[i], arr[j]] = [arr[j], arr[i]]; // swap
        }
        return setArray(arr)
    }

    // function changeDifficult(data) {
    //     console.log(`${data}`)
    //     const object = { difficulty: data }
    //     userDataUpdate(object, setUserData, `/${router.query.Smateria.toLowerCase()}/progress/${simulacro[router.query.Answers - 1].id}`)
    // }

    function changeDifficult(difficulty) {
        const object = { difficulty }

        difficulty == 'F' && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success >= 3 && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].mistakes * 3 <= userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success
            ? userDataUpdate(object, setUserData, `/${router.query.Smateria.toLowerCase()}/progress/${simulacro[router.query.Answers - 1].id}`, setUserSuccess)
            : (difficulty == 'F' ? setUserSuccess('noF') : '')

        difficulty == 'R' && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success >= 2 && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].mistakes * 2 <= userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success
            ? userDataUpdate(object, setUserData, `/${router.query.Smateria.toLowerCase()}/progress/${simulacro[router.query.Answers - 1].id}`, setUserSuccess)
            : (difficulty == 'R' ? setUserSuccess('noR') : '')

        difficulty == 'D' && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id]
            ? userDataUpdate(object, setUserData, `/${router.query.Smateria.toLowerCase()}/progress/${simulacro[router.query.Answers - 1].id}`, setUserSuccess)
            : (difficulty == 'D' ? setUserSuccess('noD') : '')
    }

    function back() {
        router.query.Answers > 1
            ? router.push(`/Simulacro/${router.query.Smateria}/Answers/${parseInt(router.query.Answers) - 1}`)
            : ''
        setSelect(null)
    }
    function next() {
        router.query.Answers < simulacro.length
            ? router.push(`/Simulacro/${router.query.Smateria}/Answers/${parseInt(router.query.Answers) + 1}`)
            : ''
        setSelect(null)
    }
    function finish() {
        router.push(`/Home/`)
    }
    function nav(i) {
        router.push(`/Simulacro/${router.query.Smateria}/Answers/${parseInt(i) + 1}`)
        setSelect(null)
    }
    // function changeDifficult (data) {
    //     `${router.query.Smateria.toLowerCase()}/progress/${simulacro[router.query.Answers - 1].id}`
    //     console.log(simulacro[router.query.Answers - 1].id)
    // }

    // console.log(userDB.subjects[router.query.Smateria.toLowerCase()].progress)
    // console.log(simulacro)


    // fisherYatesShuffle(array)
    // userDB.university !== null && userDB.university !== undefined
    //     ? getEspecificData(userDB.university, router.query.Smateria, userDB.subjects[router.query.Smateria.toLowerCase()].config.questions, simulacro, setUserSimulacro, bank, setUserBank)
    //     : ''



    return (
        <PageSimulacro>
            {userDB !== 'loading' &&
                <div className={style.container}>
                    {simulacro !== null &&
                        <>
                            <span className={style.timer}>{`${userDB.subjects[router.query.Smateria.toLowerCase()].config.time}:00`}</span>
                            <div className={style.dataContainer}>
                                <div className={style.asksBar}>
                                    {simulacro.map((item, index) =>
                                        <div key={index} className={`${simulacro[index].userAnswer !== undefined && simulacro[index].userAnswer == simulacro[index].respuesta ? style.green : ''} ${simulacro[index].userAnswer !== undefined && simulacro[index].userAnswer !== simulacro[index].respuesta ? style.red : ''} ${simulacro[index].userAnswer == undefined ? style.gray : ''} ${router.query.Answers == index + 1 ? style.focus : ''}`} onClick={() => nav(index)}></div>
                                    )}
                                </div>
                                <div className={style.counters}>
                                    <span className={style.asksCount}>Item: {router.query.Answers}/{simulacro.length}</span>
                                    <div className={style.selectDifficult}>
                                        <button className={`${style.buttonDifficult} ${userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success >= 3 && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].mistakes * 3 <= userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success ? style.buttonDifficultActive : ''} ${userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].difficulty == 'F' ? style.buttonDifficultSelect : ''}`} onClick={() => changeDifficult('F')}>F</button>
                                        <button className={`${style.buttonDifficult} ${userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success >= 2 && userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].mistakes * 2 <= userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].success ? style.buttonDifficultActive : ''} ${userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].difficulty == 'R' ? style.buttonDifficultSelect : ''}`} onClick={() => changeDifficult('R')}>R</button>
                                        <button className={`${style.buttonDifficult} ${userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id] ? style.buttonDifficultActive : ''} ${userDB.subjects[router.query.Smateria.toLowerCase()].progress[simulacro[router.query.Answers - 1].id].difficulty == 'D' ? style.buttonDifficultSelect : ''}`} onClick={() => changeDifficult('D')}>D</button>
                                    </div>
                                    <span className={`${style.answersCount} ${simulacro[router.query.Answers - 1].userAnswer !== undefined && simulacro[router.query.Answers - 1].userAnswer == simulacro[router.query.Answers - 1].respuesta ? style.greenBorder : ''} ${simulacro[router.query.Answers - 1].userAnswer !== undefined && simulacro[router.query.Answers - 1].userAnswer !== simulacro[router.query.Answers - 1].respuesta ? style.redBorder : ''} ${simulacro[router.query.Answers - 1].userAnswer == undefined ? style.grayBorder : ''} `} >
                                        {`${simulacro[router.query.Answers - 1].userAnswer !== undefined && simulacro[router.query.Answers - 1].userAnswer == simulacro[router.query.Answers - 1].respuesta ? 'BIEN 😍' : ''} ${simulacro[router.query.Answers - 1].userAnswer !== undefined && simulacro[router.query.Answers - 1].userAnswer !== simulacro[router.query.Answers - 1].respuesta ? 'ERROR 😭' : ''} ${simulacro[router.query.Answers - 1].userAnswer == undefined ? 'VACIO 😅' : ''} `}
                                    </span>
                                </div>
                            </div>
                            <div className={style.asksContainer}>
                                <span className={style.move} onClick={back}>{'<|'}</span>
                                <p className={style.ask}>{simulacro[router.query.Answers - 1].pregunta}</p>
                                <span className={style.move} onClick={next}>{'|>'}</span>
                            </div>
                            <div className={style.answersContainer}>
                                <div className={`${style.answerButtons} ${simulacro[router.query.Answers - 1].respuesta == fisherArray[0] ? style.green : ''} ${simulacro[router.query.Answers - 1].userAnswer !== simulacro[router.query.Answers - 1].respuesta && simulacro[router.query.Answers - 1].userAnswer == fisherArray[0] ? style.red : ''} ${simulacro[router.query.Answers - 1].userAnswer == undefined && simulacro[router.query.Answers - 1].respuesta !== fisherArray[0] ? style.grayButton : ''} `}> {simulacro[router.query.Answers - 1][`${fisherArray[0]}`]} </div>
                                <div className={`${style.answerButtons} ${simulacro[router.query.Answers - 1].respuesta == fisherArray[1] ? style.green : ''} ${simulacro[router.query.Answers - 1].userAnswer !== simulacro[router.query.Answers - 1].respuesta && simulacro[router.query.Answers - 1].userAnswer == fisherArray[1] ? style.red : ''} ${simulacro[router.query.Answers - 1].userAnswer == undefined && simulacro[router.query.Answers - 1].respuesta !== fisherArray[1] ? style.grayButton : ''} `}> {simulacro[router.query.Answers - 1][`${fisherArray[1]}`]} </div>
                                <div className={`${style.answerButtons} ${simulacro[router.query.Answers - 1].respuesta == fisherArray[2] ? style.green : ''} ${simulacro[router.query.Answers - 1].userAnswer !== simulacro[router.query.Answers - 1].respuesta && simulacro[router.query.Answers - 1].userAnswer == fisherArray[2] ? style.red : ''} ${simulacro[router.query.Answers - 1].userAnswer == undefined && simulacro[router.query.Answers - 1].respuesta !== fisherArray[2] ? style.grayButton : ''} `}> {simulacro[router.query.Answers - 1][`${fisherArray[2]}`]} </div>
                                <div className={`${style.answerButtons} ${simulacro[router.query.Answers - 1].respuesta == fisherArray[3] ? style.green : ''} ${simulacro[router.query.Answers - 1].userAnswer !== simulacro[router.query.Answers - 1].respuesta && simulacro[router.query.Answers - 1].userAnswer == fisherArray[3] ? style.red : ''} ${simulacro[router.query.Answers - 1].userAnswer == undefined && simulacro[router.query.Answers - 1].respuesta !== fisherArray[3] ? style.grayButton : ''} `}> {simulacro[router.query.Answers - 1][`${fisherArray[3]}`]} </div>
                                <button className={style.buttonFinishAnswer} onClick={finish}>Finalizar</button>
                            </div>
                        </>}
                </div>
            }
            {success == 'save' && <Success>Actualizando</Success>}
            {success === 'noF' && <Error>Tus aciertos acumulados deben ser el doble de tus errores o tener 3 aciertos como minimo</Error>}
            {success === 'noR' && <Error>Tus aciertos acumulados deben ser el doble de tus errores o tener 2 aciertos como minimo</Error>}
            {success === 'noD' && <Error>Debes tener por lo menos un intento</Error>}
        </PageSimulacro>
    )
}
export default WithAuth(Simulacro)







  // // if (userDB.premium === false && userDB.s + userDB.es > 30) {
        // //     setUserSuccess(false) 
        // // return}
        // setSelect(answer)
        // const query = router.query.Simulacro.toLowerCase()
        // //Consulta: si la respuesta es correcta
        // if (answer == simulacro[router.query.Index - 1].respuesta) {
        //     setCountR(countR + 1)
        //     //Consulta: si el progress existe
        //     if (userDB.subjects[router.query.Simulacro.toLowerCase()].progress) {
        //         //Consulta: si un item existe dentro del progress
        //         if (userDB.subjects[router.query.Simulacro.toLowerCase()].progress[simulacro[router.query.Index -1].id]) {
        //             console.log('Consulta: si un item existe dentro del progress')
        //             const dataDB = userDB.subjects[router.query.Simulacro.toLowerCase()].progress
        //             const dataDBid = userDB.subjects[router.query.Simulacro.toLowerCase()].progress[simulacro[router.query.Index -1].id]
        //             const object = {}
        //             object[simulacro[router.query.Index - 1].id] = { points: dataDBid.points + 1, errors: dataDBid.errors, difficulty: dataDBid.difficulty }
        //             userDataUpdate({ ...dataDB, ...object }, setUserData, `${query}/progress`)
        //             //Consulta: si un item no existe dentro del progress    
        //         } else {
        //             console.log('Consulta: si un item no existe dentro del progress ')
        //             console.log(userDB.subjects[router.query.Simulacro.toLowerCase()].progress[simulacro[router.query.Index -1].id])
        //             const dataDB = userDB.subjects[router.query.Simulacro.toLowerCase()].progress
        //             const object = {}
        //             object[simulacro[router.query.Index - 1].id] = { points: 1, errors: 0, difficulty: false }
        //             userDataUpdate({ ...dataDB, ...object }, setUserData, `${query}/progress`)
        //         }
        //         //si el progreso no existe
        //     } else {
        //         console.log('si el progreso no existe')
        //         const object = { progress: {} }
        //         object.progress[simulacro[router.query.Index - 1].id] = { points: 1, errors: 0, difficulty: false }
        //         userDataUpdate(object, setUserData, query)
        //     }
        //     //si la respuesta es incorrecta
        // } else {
        //     setCountE(countE + 1)
        //     //Consulta: si el progress existe
        //     if (userDB.subjects[router.query.Simulacro.toLowerCase()].progress) {
        //         //Consulta: si un item existe dentro del progress
        //         if (userDB.subjects[router.query.Simulacro.toLowerCase()].progress[simulacro[router.query.Index - 1].id]) {
        //             console.log('existe')
        //             const dataDB = userDB.subjects[router.query.Simulacro.toLowerCase()].progress
        //             const dataDBid = userDB.subjects[router.query.Simulacro.toLowerCase()].progress[simulacro[router.query.Index -1].id]
        //             const object = {}
        //             object[simulacro[router.query.Index - 1].id] = { points: dataDBid.points, errors: dataDBid.errors + 1, difficulty: dataDBid.difficulty }
        //             userDataUpdate({ ...dataDB, ...object }, setUserData, `${query}/progress`)
        //             //Consulta: si un item no existe dentro del progress    
        //         } else {
        //             const dataDB = userDB.subjects[router.query.Simulacro.toLowerCase()].progress
        //             const object = {}
        //             object[simulacro[router.query.Index - 1].id] = { points: 0, errors: 1, difficulty: false }
        //             userDataUpdate({ ...dataDB, ...object }, setUserData, `${query}/progress`)
        //         }
        //         //si el progreso no existe
        //     } else {
        //         const object = { progress: {} }
        //         object.progress[simulacro[router.query.Index - 1].id] = { points: 0, errors: 1, difficulty: false }
        //         userDataUpdate(object, setUserData, query)
        //     }
        // }



             {/* <BlackFont>
                                <div className={style.answersContainer}>
                                    <div className={`${style.box} ${select !== null && select == array[0] && select !== simulacro[router.query.Index - 1].respuesta ? style.red : ''}  ${select !== null && array[0] == simulacro[router.query.Index - 1].respuesta ? style.green : ''}`} onClick={(e) => { selectAnswer(array[0]) }} > {simulacro[router.query.Index - 1][`${array[0]}`]} </div>
                                    <div className={`${style.box} ${select !== null && select == array[1] && select !== simulacro[router.query.Index - 1].respuesta ? style.red : ''}  ${select !== null && array[1] == simulacro[router.query.Index - 1].respuesta ? style.green : ''}`} onClick={(e) => { selectAnswer(array[1]) }} > {simulacro[router.query.Index - 1][`${array[1]}`]} </div>
                                    <div className={`${style.box} ${select !== null && select == array[2] && select !== simulacro[router.query.Index - 1].respuesta ? style.red : ''}  ${select !== null && array[2] == simulacro[router.query.Index - 1].respuesta ? style.green : ''}`} onClick={(e) => { selectAnswer(array[2]) }} > {simulacro[router.query.Index - 1][`${array[2]}`]} </div>
                                    <div className={`${style.box} ${select !== null && select == array[3] && select !== simulacro[router.query.Index - 1].respuesta ? style.red : ''}  ${select !== null && array[3] == simulacro[router.query.Index - 1].respuesta ? style.green : ''}`} onClick={(e) => { selectAnswer(array[3]) }} > {simulacro[router.query.Index - 1][`${array[3]}`]} </div>
                                    <button className={style.button} onClick={finish}>Finalizar</button>
                                </div>
                            </BlackFont> */}


