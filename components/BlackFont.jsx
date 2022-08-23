import style from '../styles/BlackFont.module.css'

export default function BlackFont ({ children }) {
  return (
    <div className={style.blackFont}>
        <div className={style.icon}>
              <div></div>
              <div></div>
              <div></div>
        </div>
        {children}
    </div>
  )
}
