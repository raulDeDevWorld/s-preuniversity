import React, { useState, useMemo, useContext} from 'react'

const UserContext = React.createContext()

export function UserProvider ({ children }) {

	// Data de un usuario proveido por FIREBASE AUTHENTICATION
	const [user, setUser] = useState(undefined)
	// Data de un usuario proveido por FIREBASE DATABASE
	const [userDB, setUserDB] = useState('loading')
	// Avatar seleccionado en el PROCESO DE REGISTRO de un usuario
	const [avatar, setAvatar] = useState(null)
	const [progress, setProgress] = useState([])
	const [success, setSuccess] = useState(null)
	const [uniData, setUniData] = useState(null)
	const [bank, setBank] = useState(null)
	const [simulacro, setSimulacro] = useState(null)
	const [time, setTime] = useState(true)
	const [fisherArray, setFisherArray] = useState(['a', 'b', 'c', 'd'])
	const [id, setId] = useState(null)

	function setUniversityData (data) {
		setUniData(data)
	}
	function setUserProfile (userProfile) {
		setUser(userProfile)
	}
	function setUserData (userDatabase) {
		setUserDB(userDatabase)
	}
	function setUserAvatar (userAvatar) {
		setAvatar(userAvatar)
	}
	function setTeacherId (uid) {
		setId(uid)
	}
	function setStudentsProgress (obj) {
		setProgress(obj)
	}
	function setUserSuccess (mode) {
		setSuccess(mode)
		setTimeout(()=>{ setSuccess(null)}, 6000)
	}
	function setUserBank (obj) {
		setBank(obj)
	}
	function setUserSimulacro (arr, cantidad) {
		if (cantidad !== null) {
			for (var i = arr.length - 1; i > 0; i--) {
				var j = Math.floor(Math.random() * (i + 1)); //random index
				[arr[i], arr[j]] = [arr[j], arr[i]]; // swap
			}
			return setSimulacro(arr.slice([0 - cantidad]))
		} else {
			return setSimulacro(arr)
		}
		
		
	}
	function setUserTimeDB (timeDB) {
		setTime(timeDB)
	}
	function setUserFisherArray (arr) {
		setFisherArray(arr)
	}
	const value = useMemo(()=>{
		return ({
			uniData,
			user,
			userDB,
			avatar,
			id,
			progress,
			success,
			bank,
			simulacro,
			time,
			fisherArray,
			setUniversityData,
			setUserProfile,
			setUserData,
			setUserAvatar,
			setTeacherId,
			setStudentsProgress,
			setUserSuccess,
			setUserBank,
			setUserSimulacro,
			setUserTimeDB,
			setUserFisherArray,
		})
	}, [fisherArray, time, bank, simulacro, uniData, avatar, user, userDB, id, success, progress])

	return (
		<UserContext.Provider value={value} >
			{ children }
		</UserContext.Provider>
	)
} 

export function useUser () {
	const context = useContext(UserContext)
	if(!context){
		throw new Error('error')
	}
	return context
}