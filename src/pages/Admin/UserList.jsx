import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Breadcrumb from "../../conponents/Breadcrumb";
import { useAuth } from '../../contexts/AuthContext';
import { tr } from 'date-fns/locale';

function UserManagementList() {
    const { headerHeight, loading, userToken } = useAuth();
    const isFirstRender = useRef(true); // 記錄是否是第一次渲染
    const [apiLoading, setApiLoading] = useState(false); // 使否開啟loading，傳送並等待API回傳時開啟
    const [users, setUsers] = useState([])

    // 麵包屑
    const breadcrumb = [
        { name: '首頁', path: "/" },
        { name: '會員列表', path: "/userList" },
    ];


    const getUsers = async () => {
        try {
            const res = await axios.get('https://n7-backend.onrender.com/api/v1/admin/users', {
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${userToken}`// token 放這
                }
            })

            setApiLoading(false)

            if (res.data.status) {
                setUsers(res.data.data || [])
                console.log(res.data.data || [])
                console.log('API 回傳資料:', res.data.data)
            } else {
                if (res.data.message === '尚未登入') {
                    navigate('/login')
                } else {
                    navigate('/')
                }
            }
        } catch (err) {
            setApiLoading(false)
            console.error('取得使用者失敗', err)
            navigate('/ErrorPage')
        }
    }

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            getUsers()
        }
    }, [])

    const patchUserStatus = async (id) => {
        try {
            const res = await axios.patch(`https://n7-backend.onrender.com/api/v1/admin/users/${id}/toggle-block`,
                {},
                {
                    headers: {
                        "Content-Type": "application/json",
                        "Authorization": `Bearer ${userToken}`// token 放這
                    }
                }
            )

            getUsers()
        } catch (err) {
            console.error('切換使用者狀態失敗', err)
        }
    }

    return (
        <>
            <div className="container py-5">

                <Breadcrumb breadcrumbs={breadcrumb} />

                <h2 className="mb-lg-7 mb-4">會員列表</h2>

                <table className="table">
                    <thead>
                        <tr className='text-start'>
                            <th scope="col">會員編號</th>
                            <th scope="col">姓名</th>
                            <th scope="col">信箱</th>
                            <th scope="col" className='text-end'>票券數量</th>
                            <th scope="col" className='text-center'>狀態</th>
                            <th scope="col" className='text-center'>狀態</th>
                            <th scope="col">詳細資訊</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map(user => (
                            <tr key={user.id}>
                                <td>{user.id.slice(0, 8)}</td>
                                <td>{user.name}</td>
                                <td>{user.email}</td>
                                <td className='text-end'>{user.count}</td>
                                <td className='text-center'>
                                    {user.isBlocked ? '封鎖' : '正常'}
                                </td>
                                <td className='text-center'>
                                    <button
                                        className={`btn btn-sm ${user.isBlocked ? 'btn-secondary' : 'btn-danger'}`}
                                        onClick={() => patchUserStatus(user.id)}
                                    >
                                        {user.isBlocked ? '取消封鎖' : '封鎖'}
                                    </button>

                                </td>
                                <td>
                                    <button className="btn btn-sm btn-primary">
                                        查看詳細資訊
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

            </div>
        </>
    );
}

export default UserManagementList;