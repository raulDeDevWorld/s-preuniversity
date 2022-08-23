import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { handleSignOut } from '../firebase/utils'
import style from '../styles/Navbar.module.css'

export default function Navbar () {
  const [menu, setMenu] = useState(false)
  const { pathname } = useRouter() 
  function handleMenu(){
    setMenu(!menu)
  }
  return (
    <header className={style.header}>
    <div className={style.navbar}>
        <img src="/LogoMasterWhite.svg" className={style.logo} alt="logo" />
         {/* <div className={style.menu} onClick={handleMenu}>
            <span className={style.span}></span>
            <span className={style.span}></span>
            <span className={style.span}></span>
        </div>    */}
        <div className={style.menu} onClick={handleMenu}>
            <span className={`${style.span} ${menu === true ? style.transformOne : ''}`}></span>
            <span className={`${menu === false ? style.span : ''}`}></span>
            <span className={`${style.span} ${menu === true ? style.transformTwo : ''}`}></span>
        </div> 
    </div>   
    {/* <div className={style.directAcces}>
        <Link href="/Home">
          <a className={`${style.linkAD} ${pathname == "/Simulacro" ? style.active : ''}`}>Simulacro</a>
        </Link>
        <Link href="/Home">
          <a className={`${style.linkAD} ${pathname == "/Promedio" ? style.active : ''}`}>Promedio</a>
        </Link>
    </div> */}
    <nav className={`${style.nav} ${menu === true ? style.visible : ''}`}>
      <Link href="/Home">
        <a className={`${style.link} ${pathname == "/Home" ? style.active : ''}`}>Home</a>
      </Link>
      <Link href="/Config">
        <a className={`${style.link} ${pathname == "/Config"? style.active : ''}`}>Configuración</a>
      </Link>
      <Link href="/About">
        <a className={`${style.link} ${pathname == "/About"? style.active : ''}`}>Acerca de</a>
      </Link>
      <button className={style.button} onClick={handleSignOut}>Cerrar Sesion</button> 
    </nav>
  
  </header>
  )}