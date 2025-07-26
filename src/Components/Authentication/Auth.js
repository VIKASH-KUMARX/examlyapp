import React, { useEffect, useState } from 'react'

export const AuthContext = React.createContext();

export function Auth({children}) {
    const [login, setLogin] = useState(()=>{
        const stored = localStorage.getItem('login');
        return stored ? JSON.parse(stored) :  false;
    })

    useEffect(()=>{
        console.log("LOGIN status: ", login, typeof login);
        localStorage.setItem('login',JSON.stringify(login));
    },[login])

  return (
    <AuthContext.Provider value={{login, setLogin}}>
        {children}
    </AuthContext.Provider>
  )
}
