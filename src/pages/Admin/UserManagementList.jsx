import React, { useEffect, useState } from 'react'
import axios from 'axios'

function UserManagementList() {

    const [users, setUsers] = useState([])

    const fetchUsers = async () => {
        try {
            const res = await axios.get('https://n7-backend.onrender.com/api/v1/users')
            if (res.data.status) {
                setUsers(res.data.users || [])
                console.log(res.data.users || [])
                console.log('API 回傳資料:', res.data)
            }
        } catch (err) {
            console.error('取得使用者失敗', err)
        }
    }

    const handleToggleRole = async (userId, currentRole) => {
        const newRole = currentRole === 'Admin' ? 'General' : 'Admin'
        try {
            await axios.patch(`https://n7-backend.onrender.com/api/v1/users/${userId}/role`, {
                role: newRole
            })
            fetchUsers()
        } catch (err) {
            console.error('角色更新失敗', err)
        }
    }

    useEffect(() => {
        fetchUsers()
    }, [])


    return (
        <>
            <div className="container py-5">
                <div className="p-6 max-w-5xl mx-auto">
                    <h1 className="text-2xl font-bold mb-4">會員管理</h1>
                    <table className="w-full table-auto border">
                        <thead>
                            <tr className="bg-gray-100">
                                <th className="p-2 border">姓名</th>
                                <th className="p-2 border">信箱</th>
                                <th className="p-2 border">權限</th>
                                <th className="p-2 border">狀態</th>
                                <th className="p-2 border">操作</th>
                                <th className="p-2 border">詳細資訊</th>
                            </tr>
                        </thead>
                        <tbody>
                            {users.map(user => (
                                <tr key={user.id} className="text-center">
                                    <td className="p-2 border">{user.name}</td>
                                    <td className="p-2 border">{user.email}</td>
                                    <td className="p-2 border">{user.role}</td>
                                    <td className="p-2 border">{user.status}</td>

                                    <td className="p-2 border">
                                        <button
                                            onClick={() => handleToggleRole(user.id, user.role)}
                                            className="px-3 py-1 border-0 bg-primary text-white rounded"
                                        >
                                            切換為 {user.role === 'Admin' ? 'General' : 'Admin'}
                                        </button>
                                    </td>
                                    <td className="p-2 border">
                                        <button className="px-3 py-1 border-0 bg-primary text-white rounded">
                                            查看詳細資訊
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}

export default UserManagementList;