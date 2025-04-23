// contexts/AuthContext.jsx
import { createContext, useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // 例如：'admin'、'member'、null
  const [userName, setUserName] = useState(null); 
  const [userToken, setUserToken] = useState(null); 
  const [loading, setLoading] = useState(true);
  

  const login = (role, name, token) =>{
    setUserRole(role)
    setUserName(name)
    setUserToken(token)
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);
  } ;
  const logout = () =>{
    setUserRole(null);
    setUserName(null);
    setUserToken(null);
    localStorage.clear();
  } 

 

  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  //取得使用者資料
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isFirstRender.current && token) {
      isFirstRender.current = false; // 更新為 false，代表已執行過
      // console.log("✅ useEffect 只執行一次");
      fetch("https://n7-backend.onrender.com/api/v1/users/auth",{
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`, // token 放這
        }}) 
      .then(res => res.json())
      .then(result => {
        if(!result.status){
          localStorage.clear();
          navigate("/")
        }
        else{
          const role = localStorage.getItem("role");
          const name = localStorage.getItem("name");
          setUserRole(role)
          setUserName(name)
          setUserToken(token)
        }
        setLoading(false); // 驗證結束
      
      })
      .catch(err => {
        console.log(err);
      });
    }
    else if(!token){
      setLoading(false); // 驗證結束
    }
  
  }, []);

 
  return (
    <AuthContext.Provider value={{ userRole, login, logout, userName, userToken, setUserName, loading }}>
      {children}
      
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
