// contexts/AuthContext.jsx
import { createContext, useEffect, useContext, useState, useRef } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [userRole, setUserRole] = useState(null); // 例如：'admin'、'member'、null
  const [userName, setUserName] = useState(null); 
  const [userToken, setUserToken] = useState(null); 

  const login = (role, name, token) =>{
    setUserRole(role)
    setUserName(name)
    setUserToken(token)
  } ;
  const logout = () => setUserRole(null);

 
  return (
    <AuthContext.Provider value={{ userRole, login, logout, userName, userToken, setUserName  }}>
      {children}
      
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
