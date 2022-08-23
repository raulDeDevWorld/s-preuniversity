import BlackFont from '/components/BlackFont'
import { useUser } from '../context/Context.js'
import style from '../styles/Modal.module.css'
import { useState, useEffect } from 'react'

export default function Progreso(props) {
    const { userDB } = useUser()

    useEffect(() => {

    }, [userDB])
    return (
        <>
            {props.mode && <div className={style.modalContainer}>
                <div className={style.blackModalContainer}>
                    <BlackFont>
                        <div className={style.blackModal}>
                            <span onClick={props.click} className={style.x}>X</span>
                            {props.children}
                        </div>
                    </BlackFont>


                </div>

            </div>}
        </>
    )
}