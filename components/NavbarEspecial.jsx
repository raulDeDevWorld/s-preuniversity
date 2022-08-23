import { useState } from 'react'
import { useRouter } from 'next/router'
import style from '../styles/NavbarEspecial.module.css'

export default function NavbarEspecial () {
  const [menu, setMenu] = useState(false)
  const { pathname } = useRouter() 
  function handleMenu(){
    setMenu(!menu)
  }
  return (
      <header className={style.header}>
               <img src="/LogoMasterWhite.svg" className={style.logo} alt="Logo" />
               <img src={`/robot.png`} className={style.robot} alt="Swoou Robot" />
      </header>
  )}