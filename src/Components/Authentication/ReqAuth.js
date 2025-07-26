import React, { useContext } from 'react'
import { AuthContext } from './Auth'
import { Navigate } from 'react-router-dom';

export function ReqAuth({children}) {
    const {login} = useContext(AuthContext);
    if(login) return children;
    return <Navigate to='/' />;
}
