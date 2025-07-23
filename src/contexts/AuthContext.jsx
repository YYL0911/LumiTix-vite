// contexts/AuthContext.jsx
import { createContext, useEffect, useContext, useState, useRef } from 'react';
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";


import Loading from '../conponents/Loading';

import {checkAuth, getEventTypes} from '../api/user'
import { setTokenGetter } from '../utils/token'

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const [userRole, setUserRole] = useState(null); // 例如：'admin'、'member'、null
  const [userName, setUserName] = useState(null); 
  const [userToken, setUserToken] = useState(null); 
  const [loading, setLoading] = useState(true);

  const [headerHeight, setHeaderHeight] = useState(0);

  const [eventTypes, setEventTypes] = useState([]);
  const [eventTypesOri, setEventTypesOri] = useState([]);


  
  const login = (role, name, token) =>{
    setUserRole(role)
    setUserName(name)
    setUserToken(token)
    localStorage.setItem("token", token);
    localStorage.setItem("role", role);
    localStorage.setItem("name", name);

    setTokenGetter(() => token)
  } ;
  const logout = () =>{
    setUserRole(null);
    setUserName(null);
    setUserToken(null);
    localStorage.clear();
    setTokenGetter(() => "")
  } 

 
  const getEventTypeApi  = () => {
    getEventTypes()
    .then(result => {
      // 新增一個自定義類別
      const customType = {
        id: 'all', // 可自定義為固定值，前端辨識用途
        name: '全部種類',
      };

      const sorted = [...result.data].sort((a, b) => {
        if (a.name === '其他') return 1;
        if (b.name === '其他') return -1;
        return 0;
      });
      setEventTypesOri([...sorted])
      setEventTypes([customType, ...sorted])
    })
    .catch(err => {
      navigate("/ErrorPage")
    })
    .finally (() =>{
      setLoading(false); // 驗證結束
    })
  }

  
  const isFirstRender = useRef(true); // 記錄是否是第一次渲染
  //取得使用者資料
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (isFirstRender.current && token) {
      setTokenGetter(() => token)
      isFirstRender.current = false; // 更新為 false，代表已執行過
      
      checkAuth()
      .then(res => {
        const role = localStorage.getItem("role");
        const name = localStorage.getItem("name");
        setUserRole(role)
        setUserName(name)
        setUserToken(token)
        getEventTypeApi()
      })
      .catch(err => {
        getEventTypeApi()
        logout();
        navigate("/")
      })

    }
    else if(!token){
      getEventTypeApi()
    }

  }, []);

 
  return (
    <AuthContext.Provider value={{ 
      userRole, login, logout, userName, userToken, setUserName, loading,
      headerHeight, setHeaderHeight, eventTypes, eventTypesOri }}>
      {children}


      {loading && (<Loading></Loading>)}
      
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
