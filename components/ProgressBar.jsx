import { useState, useEffect } from 'react'
import { useUser } from '../context/Context.js'

function ProgressBar({ bgcolor, completed }) {
    const { userDB } = useUser()

    const [counter, setCounter] = useState(0)


    const containerStyles = {
        height: 14,
        width: '100%',
        fontSize: 12,
        backgroundColor: "#e0e0de",
        borderRadius: 14,
        margin: '7px 0'
    }

    const fillerStyles = {
        height: '100%',
        width: `${counter}%`,
        backgroundColor: bgcolor,
        borderRadius: 'inherit',
        textAlign: 'right',
    }

    const labelStyles = {
        padding: 5,
        color: 'white',
        fontWeight: 'bold'
    }

    useEffect(() => {
        let counterInterval = setInterval(() => {
            if (counter < completed) {
                setCounter(counter + 1);
            } else {
                clearInterval(counterInterval);
            }
        }, 10);

        return () => {
            clearInterval(counterInterval);
        };

    }, [userDB, counter, completed]);
    return (
        <div style={containerStyles}>
            <div style={fillerStyles}>
                <span style={labelStyles}>{`${counter}%`}</span>
            </div>
        </div>
    );
};

export default ProgressBar;