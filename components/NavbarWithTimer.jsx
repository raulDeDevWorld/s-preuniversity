import { useState } from 'react'
import style from '../styles/NavbarWithTimer.module.css'

export default function NavbarWithTimer() {
  const [menu, setMenu] = useState(false)
  function handleMenu() {
    setMenu(!menu)
  }
  return (
    <header className={style.header}>
      <img src="/LogoMasterWhite.svg" className={style.logo} alt="logo" />
      <div className={style.icon} onClick={handleMenu}>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </header>
  )
}


  
  
  
  
  
  
  
  
  
  
  
  
  
  
  
  {/* <nav className={`${style.nav} ${menu === true ? style.top : ''}`}>
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
    </nav> */}