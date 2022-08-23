import { useState, useEffect } from 'react'
import style from '../styles/Timer.module.css'


export default function Timer(props) {
    const [seconds, setSeconds] = useState(0)
    const [minutes, setMinutes] = useState(props.time)

    useEffect(() => {
        let sampleInterval = setInterval(() => {
            if (seconds > 0) {
                setSeconds(seconds - 1);
            }
            if (seconds === 0) {
                if (minutes === 0) {
                    clearInterval(sampleInterval);
                } else {
                    setMinutes(minutes - 1);
                    setSeconds(59);
                }
            }
        }, 1000);
        return () => {
            clearInterval(sampleInterval);
        };
    });
    return (
        <span className={props.style}>{minutes < 10? `0${minutes}` : minutes}:{seconds < 10? `0${seconds}`: seconds }</span>
    )
}