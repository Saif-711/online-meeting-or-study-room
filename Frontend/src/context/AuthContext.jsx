import {createContext, useState} from 'react';

export const AuthContext = createContext();

export default function AuthProvider({children}){
    const [token,setToken] =useState(localStorage.getItem('token'));
    const [username,setUsername] =useState(localStorage.getItem('username'));

const login = (jwt, name)=>{
    localStorage.setItem('token',jwt);
    setToken(jwt);
    if (name) {
        localStorage.setItem('username', name);
        setUsername(name);
    }
}
const logout = ()=>{
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    setToken(null);
    setUsername(null);
}
return(
    <AuthContext.Provider 
    value = 
    {{
        token,
        username,
        login,
        logout}}
    >
        {children}
    </AuthContext.Provider>
);
}
