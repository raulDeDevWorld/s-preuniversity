// import { useState, useEffect } from 'react'
import Head from 'next/head'
import style from '../styles/InitialLayout.module.css'

export default function InitialLayout ({ children }) {
  // const [msg, setMsg] = useState('')
	// const [i, setI] = useState(0)
	// const [text] = useState('Hazlo Simple flow.')

  // useEffect(() => {
	// 	const interval = setTimeout(() => {
	// 		i < text.length
	// 			? setI(i => i + 1)
	// 			: clearTimeout(interval)
	// 		setMsg(msg => msg + text.charAt(i))
	// 	}, 100)
	// 	return () => clearTimeout(interval)
	// }, [i, text]);
  return (
<>
     <Head>
        <title>Swoou Preuniversity: Banco de preguntas y Simulacro para examenes de admision</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="msapplication-navbutton-color" content="#000000" /> 
        <meta name="apple-mobile-web-app-status-bar-style" content="#000000" /> 
        <meta name="description" content="Desarrollando tecnología para hacer de un mundo complicado un mundo más sencillo" />
        <meta name="keywords" content="Swoou, Swoou preuniversity, banco de preguntas, cursos preuniversitarios, simulacro examen de admision" />
        <meta name="author" content="Raul Choque Romero" />
    </Head>
    <div className={style.container}>
      {/* <span className={style.msg}>{msg}</span>  */}
      <img src="/logo-hazlo-simple-two.svg" className={style.logo} alt="logo" />
      <main> { children } </main>
    </div>
</>
  )
}
