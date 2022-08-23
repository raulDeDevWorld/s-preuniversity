import { initializeApp } from 'firebase/app';
import { getAuth, signInWithPopup, FacebookAuthProvider, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import { getDatabase, ref, get, set, update, onValue, child, } from "firebase/database";
import { firebaseConfig } from './config'


const app = initializeApp(firebaseConfig);

const auth = getAuth();

const providerFacebook = new FacebookAuthProvider();
const providerGoogle = new GoogleAuthProvider();

//----------------------------------Authentication------------------------------------------

function onAuth(setUserProfile, setUserData) {
      return onAuthStateChanged(auth, (user) => {
            if (user) {
                  setUserProfile(user)
                  getData(user.uid, setUserData)
            } else {
                  setUserProfile(user)
            }
      });
}

function withFacebook() {
      signInWithPopup(auth, providerFacebook)
            .then((result) => {
                  // The signed-in user info.
                  const user = result.user;
                  // This gives you a Facebook Access Token. You can use it to access the Facebook API.
                  const credential = FacebookAuthProvider.credentialFromResult(result);
                  const accessToken = credential.accessToken;
                  // ...
            })
            .catch((error) => {
                  // Handle Errors here.
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  // The email of the user's account used.
                  const email = error.email;
                  // The AuthCredential type that was used.
                  const credential = FacebookAuthProvider.credentialFromError(error);

                  // ...
            });
}

function withGoogle() {
      signInWithPopup(auth, providerGoogle)
            .then((result) => {
                  // This gives you a Google Access Token. You can use it to access the Google API.
                  const credential = GoogleAuthProvider.credentialFromResult(result);
                  const token = credential.accessToken;
                  // The signed-in user info.
                  const user = result.user;
                  // ...
            }).catch((error) => {
                  // Handle Errors here.
                  const errorCode = error.code;
                  const errorMessage = error.message;
                  // The email of the user's account used.
                  const email = error.email;
                  // The AuthCredential type that was used.
                  const credential = GoogleAuthProvider.credentialFromError(error);
                  // ...
            });
}

function handleSignOut() {
      auth.signOut().then(function () {
            // Sign-out successful.
      }).catch(function (error) {
            // An error happened.
      });
}

//-----------------------------------Realtime database--------------------------------------

const db = getDatabase(app);
getDatabase(app)

//Traemos toda la DATA de un usuario autentificado
function getData(uid, setUserData) {
      const indexedDB = window.indexedDB

      if (navigator.onLine) {
            get(ref(db, `/users/${uid}`)).then((snapshot) => {
                  //Mandamos la data al CONTEXT "userDB"
                  setUserData(snapshot.val())
                  dataCompare(snapshot.val(), setUserData)
            }).catch((error) => {
                  console.error(error);
            });
      } else {
            if (indexedDB) {
                  let swoouDB
                  const request = indexedDB.open('swoouPreuniversity', 1)
                  request.onsuccess = () => {
                        swoouDB = request.result
                        console.log(swoouDB)
                        readData()
                  }
                  const readData = () => {
                        const transaction = swoouDB.transaction(['swoouPreuniversity'], 'readwrite')
                        const objectStore = transaction.objectStore('swoouPreuniversity')
                        const request = objectStore.get(uid)

                        request.onsuccess = () => {
                              request ? setUserData(request.result) : console.log('no data')
                        }
                  }
            }
      }
}

//Registro de DATOS generales de un usuario
function userDataRegister(object, router, url) {
      const uid = auth.currentUser.uid

      set(ref(db, `users/${uid}`), object)
            .then(() => {
                  createIndexedDB({...object, date: Date()})
                  router.push(url)
            })
            .catch((error) => {
                  // The write failed...
            });
}

//Actualizacion de DATOS de usuario
function userDataUpdate(object, setUserData, setUserSuccess) {
      const uid = auth.currentUser.uid
      const date = Date()
      if (navigator.onLine) {
      update(ref(db, `users/${uid}`), {...object, date })
            .then(() => {
                  setUserSuccess && setUserSuccess('save')
                  updateIndexedDB(object, setUserData)
                  getData(uid, setUserData)
            })            
      }else{
            updateIndexedDB({...object, date}, setUserData, setUserSuccess)
      }

}

//Consulta de FACULTADES para el registro
function getFac(university, setUniversityData) {

      get(ref(db, `/${university.toLowerCase()}`)).then((snapshot) => {
            if (snapshot.exists()) {
                  let obj = snapshot.val()
                  console.log(obj)
                  setUniversityData(obj)
            } else {
                  setUniversityData(null)
            }
      }).catch((error) => {
            console.error(error);
      });
}

//Creacion de IndexedDB
function createIndexedDB(userDB) {
      const indexedDB = window.indexedDB
      if(indexedDB){
            let swoouDB
            const request = indexedDB.open('swoouPreuniversity', 1)
             request.onsuccess =  (e)  => {
                  swoouDB =  e.target.result 
                  addData()                
            }
            request.onupgradeneeded = (e) => {
                  console.log(e.target.result)
                  swoouDB = e.target.result
                  const objectStore = swoouDB.createObjectStore('swoouPreuniversity', {
                        keyPath: 'uid'
                  })     
            }       
            request.onerror = (err) => {
                  console.log(err)
            }
            const addData = () => {
                  const transaction = swoouDB.transaction(['swoouPreuniversity'], 'readwrite')
                  const objectStore = transaction.objectStore('swoouPreuniversity')
                  const request = objectStore.add(userDB)
            }
      }
}

//Actualizacion de IndexedDB
function updateIndexedDB(newDB, setUserData, setUserSuccess) {
      const indexedDB = window.indexedDB

      if(indexedDB){
            let swoouDB
            const request = indexedDB.open('swoouPreuniversity', 1)

            request.onsuccess = () => {
                  swoouDB = request.result
                  transactionUpdate ()
            }
            function transactionUpdate () {
                  const transaction = swoouDB.transaction(['swoouPreuniversity'], 'readwrite')
                  const objectStore = transaction.objectStore('swoouPreuniversity')
                  const requestObjectStore = objectStore.get(auth.currentUser.uid)

                  requestObjectStore.onsuccess = () => {
                        objectStore.put({...requestObjectStore.result, ...newDB})
                        setUserData({...requestObjectStore.result, ...newDB})
                        setUserSuccess && setUserSuccess('save')
                  }
            }

      }
}

//Actualizacion de IndexedDB al FECHA MAS RECIENTE
function dataCompare(firebaseDB, setUserData) {
      const indexedDB = window.indexedDB
      if(indexedDB){
      let swoouDB
      const request = indexedDB.open('swoouPreuniversity', 1)

      request.onsuccess = async (e) => {
            swoouDB = e.target.result
            transactionDataCompare ()
      }

      request.onupgradeneeded = (e) => {
            console.log(e.target.result)
            swoouDB = e.target.result
            const objectStore = swoouDB.createObjectStore('swoouPreuniversity', {
                  keyPath: 'uid'
            })     
      }  
      const addData = () => {
            const transaction = swoouDB.transaction(['swoouPreuniversity'], 'readwrite')
            const objectStore = transaction.objectStore('swoouPreuniversity')
            
            const request = objectStore.add({date: Date(), ...firebaseDB,})
      }

      function transactionDataCompare () {
            const transaction = swoouDB.transaction(['swoouPreuniversity'], 'readwrite')
            const objectStore = transaction.objectStore('swoouPreuniversity')
            const requestObjectStore = objectStore.get(auth.currentUser.uid)
            requestObjectStore.onsuccess = () => {
                  const IDB = requestObjectStore.result
                  if (IDB == undefined) {
                        addData()
                  } else {
                        const dateIDB = requestObjectStore.result.date

                        if (dateIDB > firebaseDB.date) {
                              console.log('idb es reciente')
                              userDataUpdate({ date: Date(), ...firebaseDB, ...requestObjectStore.result }, setUserData, null)
                        } else {
                              firebaseDB.date == null ? userDataUpdate({ date: Date(), ...firebaseDB}, setUserData, null) : ''

                              console.log('fb es reciente')
                              const objectStoreUpdate = objectStore.put({ date: Date(), ...firebaseDB})
                              objectStoreUpdate.onsuccess = () => {

                              }
                              objectStoreUpdate.onerror = (e) => {
                                    console.log(e)
                              }
                        }  
                  }
            }
      }
      }
}


//Traemos todo el banco de preguntas
async function getAllBank(university, subjects, setUserBank) {
      
      const arrSubjects = Object.keys(subjects)

      const bankSubjects = await arrSubjects.reduce(async (mainObject, item) => {

            const oneBankSubjects = await get(ref(db, `${university.toLowerCase()}/Banco/${item}`)).then((snapshot) => {
                  console.log('se esta ejecutando')
                  let data = snapshot.val()
                  const obj = {}
                  obj[item.toLowerCase()] = data
                  return obj

            }).catch((error) => {
                  console.error(error);
            })

            return { ...await mainObject, ...oneBankSubjects }

      }, {})
      setUserBank(bankSubjects)
}

//Seleccionamos las preguntas para el simulacro  
function getDataForSimulacro(university, subjects, materia, cantidad, simulacro, setUserSimulacro, bank, setUserBank) {
      //Consulta si banco existe
      if (bank) {
            //Consulta si la materia existe en el banco ? Se pasa todo el banco al context mas la cantidad de preguntas requeridas : Hacemos una peticion a la base de datos
            bank[materia.toLowerCase()] ? setUserSimulacro(bank[materia.toLowerCase()], cantidad) : console.log('no exist')
      } else {
            getAllBank(university, subjects, setUserBank)
      }
}

//------------------------------Premium Config-------------------------------
const mainRefDB = ref(getDatabase(app))

function getCode(code, uid, setUserSuccess, setUserData) {
      get(ref(db, '/premiumCode')).then((snapshot) => {
            const b = snapshot.child(`${code}`).exists()
            if (b == true) {
                  var val = snapshot.child(code).val();
                  console.log(val)
                  if (val == true) {
                        update(ref(db, `/premiumCode/`), { [code]: false }).then(() => {

                              setUserSuccess(true)
                        })
                        update(ref(db, `/users/${uid}`), { premium: code, date: Date() })
                              .then(() => {

                                    getData(uid, setUserData)
                              })
                  } else {
                        setUserSuccess('EnUso')
                  }
            } else {
                  setUserSuccess('NoExiste')
            }
      });
}

export { getCode, getAllBank, userDataUpdate, getFac, onAuth, withFacebook, withGoogle, handleSignOut, userDataRegister, getDataForSimulacro }



//Actualizacion de DATOS de usuario
// function userDataUpdate(object, setUserData, query, setUserSuccess) {
//       const uid = auth.currentUser.uid

//       if (query) {
//             update(ref(db, `users/${uid}/subjects/${query.toLowerCase()}`), object)
//                   .then(() => {
//                         setUserSuccess && setUserSuccess('save')
//                         getData(uid, setUserData)
//                   })
//             return
//       }
//       update(ref(db, `users/${uid}`), object).then(() => setUserSuccess('save'))
//             .then(() => {
//                   setUserSuccess && setUserSuccess('save')
//                   getData(uid, setUserData)
//             })
// }





//---------------------------------IMPORTANTE
// function updateBank(university, materia, bank, setUserBank) {
//       get(ref(db, `${university.toLowerCase()}/Banco/${materia.toLowerCase()}`)).then((snapshot) => {
//             console.log('se esta ejecutando')
//             let data = snapshot.val()
//             const obj = {}
//             obj[materia.toLowerCase()] = data
//             setUserBank({ ...bank, ...obj })

//       }).catch((error) => {
//             console.error(error);
//       });
// }






// function userDataRegister( aName, school, cell, avatar) {
//       const name = auth.currentUser.displayName
//       const uid = auth.currentUser.uid

//       set(ref(db, `users/${uid}`), {
//             name,
//             aName,
//             school,
//             cell,
//             avatar,
//             premium: false,
//             uid,
//       })
//             .then(() => {
//                   // Data saved successfully!
//             })
//             .catch((error) => {
//                   // The write failed...
//             });
// }

//----------------------antiguo
// function manageSimulacro(materia, university, setUserSimulacro) {
//       const uid = auth.currentUser.uid

//       get(ref(db, `/${university.toLowerCase()}/Banco/${materia.toLowerCase()}`)).then((snapshot) => {
//             if (snapshot.exists()) {
//                   let object = snapshot.val()
//                   // setUserData(obj[user.uid])
//                   setUserSimulacro(object)
//             } else {
//                   setUserData(null)
//             }
//       }).catch((error) => {
//             console.error(error);
//       });
// }


// -------------------antiguo
// function getDataForSimulacro(university, materia, cantidad, simulacro, setUserSimulacro, bank, setUserBank) {
// //Consulta si banco existe
//       if (bank) {
//       //Consulta si la materia existe en el banco ? Se pasa todo el banco al context mas la cantidad de preguntas requeridas : Hacemos una peticion a la base de datos
//             bank[materia.toLowerCase()] ? setUserSimulacro(bank[materia.toLowerCase()], cantidad) : updateBank(university, materia, bank, setUserBank)
//       } else {
//             updateBank(university, materia, bank, setUserBank)
//       }
// }

function spam() {
      for (let index = 0; index < 1; index++) {
            update(ref(db, `usfx/Banco/`),  {fisica : [
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len1'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len2'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len3'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len4'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len5'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len6'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len7'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len8'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len9'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len10'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len11'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len12'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len13'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len14'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len15'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len16'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len17'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len18'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len19'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len20'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len21'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len22'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len23'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len24'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len25'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len26'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len27'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len28'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len29'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len30'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len31'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len32'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len33'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len34'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len35'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len36'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len37'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len38'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len39'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len40'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len41'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len42'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len43'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len44'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len45'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len46'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len47'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len48'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len49'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len50'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len5'
                  },

                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len52'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len53'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len54'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len55'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len56'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len57'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len58'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len59'
                  }, {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len60'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len61'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len62'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un verbo? MATE',
                        respuesta: 'c',
                        a: 'niño',
                        b: 'ada',
                        c: 'correr',
                        d: 'hambre',
                        id: 'len63'
                  },
                  {
                        pregunta: 'Cual de las siguientes opciones es un sustantivo MATE',
                        respuesta: 'b',
                        a: 'Feliz',
                        b: 'Hoja',
                        c: 'Ver',
                        d: 'Lejos',
                        id: 'len64'
                  },
            ]})
      }
}






//Consulta por un item dentro de un snapshot
// function getData(uid, setUserData) {
//       get(ref(db,`/users`)).then((snapshot) => {
//              console.log(snapshot.val())
//             var b = snapshot.child(uid).exists();
//             if (b == true) {
//                   let obj = snapshot.val()
//                   setUserData(obj[uid])
//             } else {
//                   setUserData(null)
//             }
//       }).catch((error) => {
//             console.error(error);
//       });
// }
// function query(id, setTeacherId, userUid, name, setUserSuccess, setAlert ){
//       ids.on('value', function(snapshot){  
//             var b = snapshot.child(id).exists(); 
//             if (b === true){
//                   const val = snapshot.child(`${id}`).child('uid').val()
//                   db.ref(`teachers/${val}`).once('value', function(userSnapshot){
//                         const reset = userSnapshot.child('reset').val()
//                         reset == true ? setAlert(true) : getIds(id, setTeacherId, userUid, name, setUserSuccess, true)
//                   })
//             } else {
//                   setTeacherId(false)
//                   setUserSuccess(false)

//             }
//       })
// }

// function getIds(id, setTeacherId, userUid, name, setUserSuccess, mode){
//       ids.on('value', function(snapshot){  
//             var b = snapshot.child(id).exists();     
//             if (b === true){
//                   const val = snapshot.child(`${id}`).child('uid').val()
//                   db.ref(`teachers/${val}`).once('value', function(userSnapshot){
//                         const sumaConfig= userSnapshot.child('sumaConfig').val()
//                         db.ref(`users/${userUid}`).update({ sumaConfig,})
//                   })
//                   db.ref(`teachers/${val}`).once('value', function(userSnapshot){
//                         const restaConfig= userSnapshot.child('restaConfig').val()
//                         db.ref(`users/${userUid}`).update({ restaConfig,})
//                   })
//                   db.ref(`teachers/${val}`).once('value', function(userSnapshot){
//                         const multiplicacionConfig= userSnapshot.child('multiplicacionConfig').val()
//                         db.ref(`users/${userUid}`).update({ multiplicacionConfig,})
//                   })
//                   db.ref(`teachers/${val}`).once('value', function(userSnapshot){
//                         const divisionConfig= userSnapshot.child('divisionConfig').val()
//                         db.ref(`users/${userUid}`).update({ divisionConfig,})
//                   })

//                   db.ref(`teachers/${val}`).once('value', function(userSnapshot){
//                         const reset = userSnapshot.child('reset').val()
//                         reset == true && mode == true 
//                         ? db.ref(`users/${userUid}`).update({ 
//                               s: 0,
//                               r: 0,
//                               m: 0,
//                               d: 0,
//                               es: 0,
//                               er: 0,
//                               em: 0,
//                               ed: 0,
//                        })
//                        :''
//                   })

//                   let uidTeacher = snapshot.child(id).child('uid').val()
//                   db.ref(`teachers/${uidTeacher}/students/${userUid}`).set({ 
//                          name,
//                   })
//                   db.ref(`users/${userUid}`).update({ 
//                         id,
//                         nw: true,
//                  })
//                   setTeacherId(uidTeacher)
//                   setUserSuccess(true)
            
//             } else {
//                   setTeacherId(false)
//                   setUserSuccess(false)

//             }
//       })
// }
// function getCode(code, uid, setUserSuccess, account){
//       premiumCode.once('value', function(snapshot){  
//             var b = snapshot.child(code).exists();                
//             if (b === true ){
//                   var val = snapshot.child(code).val();
//                   if(val == false) {
//                         const us = account == true ? 'teachers' : 'users' 
//                         db.ref(`/premiumCode/${code}`).set(true)
//                         db.ref(`/${us}/${uid}/premium`).set(code)
//                         setUserSuccess(true)
//                   }else{
//                         console.log('ya esta en uso')
//                         setUserSuccess(false)
//                   }
//             } else {
//                console.log('no exist')
//                setUserSuccess(false)
//             }
//       })
// }



// function getProgress (setStudentsProgress, uid ){
//       dataTeachers.on('value', function(snapshot){  
//             var b = snapshot.child(`${uid}/students`).exists(); 
//             if (b === true){
//                   const array = []
//                   snapshot.child(`${uid}/students`).forEach(function(childSnapshot) { 
//                         db.ref(`/users/${childSnapshot.key}`).once('value', function(userSnapshot){
//                               const valName = userSnapshot.child('aName').val()
//                               const s = userSnapshot.child('s').val()
//                               const r = userSnapshot.child('r').val()
//                               const m = userSnapshot.child('m').val()
//                               const d = userSnapshot.child('d').val()
//                               const es = userSnapshot.child('es').val()
//                               const er = userSnapshot.child('er').val()
//                               const em = userSnapshot.child('em').val()
//                               const ed = userSnapshot.child('ed').val()
//                               const nw = userSnapshot.child('nw').val()
//                               const userUid = userSnapshot.child('uid').val()
//                               const obj = {
//                                     name: valName,
//                                     s,
//                                     r,
//                                     m,
//                                     d,
//                                     es,
//                                     er,
//                                     em,
//                                     ed,
//                                     nw,
//                                     userUid
//                               }
//                              array.push(obj)
//                           }) 
//                    })
//                    console.log(array)
//                    setStudentsProgress(array)
              
//             } else {
//                   setStudentsProgress(null)
//             }
//       })
// }

    





// function setProgress (n, account, op) {
//       const us = account == true ? 'teachers' : 'users' 
//       const uid = auth.currentUser.uid
//       switch (op){
//             case 's':
//                   db.ref(`${us}/${uid}`).update({s: n,})
//                   break;
//             case 'r':
//                   db.ref(`${us}/${uid}`).update({r: n,})
//                   break;
//             case 'm':
//                   db.ref(`${us}/${uid}`).update({m: n,})
//                   break;
//             case 'd':
//                   db.ref(`${us}/${uid}`).update({d: n,})
//             default:
//                   break;

//       }
// }
// function setErrors (n, account, op) {
//       const us = account == true ? 'teachers' : 'users' 
//       const uid = auth.currentUser.uid
//       switch (op){
//             case 's':
//                   db.ref(`${us}/${uid}`).update({es: n,})
//                   break;
//             case 'r':
//                   db.ref(`${us}/${uid}`).update({er: n,})
//                   break;
//             case 'm':
//                   db.ref(`${us}/${uid}`).update({em: n,})
//                   break;
//             case 'd':
//                   db.ref(`${us}/${uid}`).update({ed: n,})
//             default:
//                   break;

//       }
// }

// function avatarUpdate (n, account) {
//       const us = account == true ? 'teachers' : 'users' 
//       const uid = auth.currentUser.uid
//       db.ref(`${us}/${uid}`).update({avatar: n,})
// }
// function progressReset (account, s, r, m, d, msg, acc) {
//       const us = account == true ? 'teachers' : 'users' 
//       const uid = auth.currentUser.uid
//       if (us == 'teachers') { 
//             db.ref(`${us}/${uid}/students`).once('value', function(snapshot){
//                   snapshot.forEach(function(childSnapshot) {
//                         if(s == true){ db.ref(`users/${childSnapshot.key}`).update({s: 0, es: 0,}) }
//                         if(r == true){ db.ref(`users/${childSnapshot.key}`).update({r: 0, er: 0,}) }
//                         if(m == true){ db.ref(`users/${childSnapshot.key}`).update({m: 0, em: 0,}) }
//                         if(d == true){ db.ref(`users/${childSnapshot.key}`).update({d: 0, ed: 0,}) }
//                   });
//             });
        
//       }
//       if (us == 'users') {
//             if(s == true){ db.ref(`${us}/${uid}`).update({s: 0, es: 0,}) }
//             if(r == true){ db.ref(`${us}/${uid}`).update({r: 0, er: 0,}) }
//             if(m == true){ db.ref(`${us}/${uid}`).update({m: 0, em: 0,}) }
//             if(d == true){ db.ref(`${us}/${uid}`).update({d: 0, ed: 0,}) }
//       }
//       if (us == 'teacher' && msg == 'unity') {
//             if(s == true){ db.ref(`users/${acc}`).update({s: 0, es: 0,}) }
//             if(r == true){ db.ref(`users/${acc}`).update({r: 0, er: 0,}) }
//             if(m == true){ db.ref(`users/${acc}`).update({m: 0, em: 0,}) }
//             if(d == true){ db.ref(`users/${acc}`).update({d: 0, ed: 0,}) }
//       }
     
// }

// function userDelete (userUid) {
    
//       const uid = auth.currentUser.uid
//       db.ref(`${'/teachers'}/${uid}/students/${userUid}`).remove()
//       db.ref(`${'/users'}/${userUid}`).update({id: 'Te ha eliminado'})

// }
// function playDificult (account, dificultObject) {
//       const us = account == true ? 'teachers' : 'users' 
//       const uid = auth.currentUser.uid
//       if (us == 'teachers') { 
//             db.ref(`${us}/${uid}/students`).once('value', function(snapshot){
//                   snapshot.forEach(function(childSnapshot) {
//                   db.ref(`${'/users'}/${childSnapshot.key}`).update(dificultObject)
//                   });
//             });
//             db.ref(`${us}/${uid}`).update(dificultObject)

//       }
//       if (us == 'users') { 
//             db.ref(`${us}/${uid}`).update(dificultObject)
//       }
// }

// function newStudent (uid) {
//       db.ref(`users/${uid}`).update({nw : false})
// }
// function progressResetTeacher (mode) {
//       console.log(mode)
//       const uid = auth.currentUser.uid
//       db.ref(`teachers/${uid}`).update({reset : mode})
// }
// export { manageSimulacro, userDataUpdate, getFac, query, progressResetTeacher, newStudent, playDificult, userDelete, auth, onAuth, withFacebook, withGoogle, handleSignOut, dataUser, getIds, getProgress, getCode, avatarUpdate, progressReset, setProgress, setErrors }
