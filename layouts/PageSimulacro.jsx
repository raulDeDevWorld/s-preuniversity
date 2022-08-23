import Head from 'next/head'
import NavbarWithTimer from '../components/NavbarWithTimer'
import style from '../styles/PageSimulacro.module.css'

export default function PageSimulacro({ children }) {
  return (
    <>
      <Head>
        <title>Swoou Preuniversity: Banco de preguntas y Simulacro para examenes de admision</title>
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#15202B" />
        <meta name="msapplication-navbutton-color" content="#15202B" />
        <meta name="apple-mobile-web-app-status-bar-style" content="#15202B" />
        <meta name="description" content="Desarrollando tecnología para hacer de un mundo complicado un mundo más sencillo" />
        <meta name="keywords" content="Swoou, Swoou preuniversity, banco de preguntas, cursos preuniversitarios, simulacro examen de admision" />
        <meta name="author" content="Raul Choque Romero" />
      </Head>

      <div className={style.container}>
        <NavbarWithTimer />
        <main className={style.mainContainer}> {children} </main>
        {/* <div className={style.vector}>
          <button className={style.button}><a href="https://api.whatsapp.com/send?phone=+59173447725&text=buenas,%20me%20gustaria%20comunicarme%20con%20un%20%20operador(a)%20">Operador(a)</a></button>
        </div> */}
        <footer className={style.footer}>
          copyright 2022<br />swoou.com
          <button className={style.button}><a href="https://api.whatsapp.com/send?phone=+59173447725&text=buenas,%20me%20gustaria%20comunicarme%20con%20un%20%20operador(a)%20">Operador(a)</a></button>
        </footer>
      </div>
    </>
  )
}
