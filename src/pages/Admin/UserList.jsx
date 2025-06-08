import { useEffect, useState, useRef } from 'react'
import axios from 'axios'
import Breadcrumb from "../../conponents/Breadcrumb";
import { useAuth } from '../../contexts/AuthContext';

import PaginationComponent from "../../conponents/Pagination";

function UserManagementList() {
    const { loading, userToken } = useAuth();
    const isFirstRender = useRef(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [users, setUsers] = useState([])

    // 麵包屑
    const breadcrumb = [
        { name: '首頁', path: "/" },
        { name: '一般會員列表', path: "/userList" },
    ];

    // 列表分頁
    const [pagedUsers, setPagedUsers] = useState([]);
    const [totalPages, setTotalPages] = useState(Math.ceil(users.length / 10));
    const [currentPage, setCurrentPage] = useState(1);

    useEffect(() => {
        const pageSize = 10;
        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;
        const pageData = users.slice(startIndex, endIndex);
        setPagedUsers(pageData);
        setTotalPages(Math.ceil(users.length / pageSize));
    }, [users, currentPage]);

    // 取得一班會員列表
    useEffect(() => {
        const getUsers = async () => {
            try {
                const res = await axios.get('https://n7-backend.onrender.com/api/v1/admin/users', {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    }
                })

                setApiLoading(false)
                setUsers(res.data.data || [])
                // console.log('API 回傳資料:', res.data.data)
                setCurrentPage(1);
            } catch (err) {
                setApiLoading(false)
                console.error('取得使用者失敗', err)
                navigate('/ErrorPage')
            }
        }

        if (isFirstRender.current) {
            isFirstRender.current = false;
            getUsers();
        }
    }, []);

    // 切換會員狀態
    const changeUserState = async (id) => {
        try {
            const res = await axios.patch(
                `https://n7-backend.onrender.com/api/v1/admin/users/${id}/toggle-block`,
                {},
                {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                }
            );

            console.log('後端回應：', res.data);

            const updatedUsers = users.map(user =>
                user.id === id ? { ...user, isBlocked: !user.isBlocked } : user
            );

            setUsers(updatedUsers);
            setPagedUsers(updatedUsers.slice((currentPage - 1) * 10, currentPage * 10));

        } catch (err) {
            console.error('切換使用者狀態失敗', err.response?.data || err.message);
        }
    };

    // 收尋會員
    const [searchTerm, setSearchTerm] = useState('');
    const [tempSearchTerm, setTempSearchTerm] = useState('');

    const handleSearch = () => {
        setCurrentPage(1);
        setSearchTerm(tempSearchTerm);
    };

    useEffect(() => {
        const pageSize = 10;
        const filteredUsers = users.filter(user =>
            user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase())
        );

        const startIndex = (currentPage - 1) * pageSize;
        const endIndex = startIndex + pageSize;

        setPagedUsers(filteredUsers.slice(startIndex, endIndex));
        setTotalPages(Math.ceil(filteredUsers.length / pageSize));
    }, [users, searchTerm, currentPage]);

    return (
        <>
            <div className="container py-3 px-md-5">

                <Breadcrumb breadcrumbs={breadcrumb} />


                <div className='d-flex flex-column flex-lg-row gap-2 justify-content-between mb-4'>
                    <h2 className="text-lg-start text-center">一般會員列表</h2>

                    <div className="d-flex m-lg-0 m-auto" style={{ width: '350px' }}>
                        <input
                            type="text"
                            className="form-control rounded-end-0"
                            placeholder="搜尋會員（名稱 / 信箱）"
                            aria-describedby="searchUserBtn"
                            value={tempSearchTerm}
                            onChange={(e) => setTempSearchTerm(e.target.value)}
                            onKeyDown={(e) => { if (e.key === 'Enter') handleSearch(); }}
                        />
                        <button
                            className="btn btn-secondary rounded-0 rounded-end"
                            style={{ width: '120px' }}
                            type="button"
                            id="searchUserBtn"
                            onClick={handleSearch}
                        >
                            搜尋會員
                        </button>
                    </div>
                </div>

                <div className='text-lg-end text-start'>
                    <span className='fs-7'>會員總數 : {users.length}</span>
                </div>

                <div className="user-table-container d-flex flex-column" style={{ height: '680px' }}>
                    
                    <div className="flex-grow-1 overflow-auto table-responsive-lg">
                        <table className="table">
                            <thead>
                                <tr className='text-start'>
                                    <th style={{ minWidth: '120px' }}>會員編號</th>
                                    <th style={{ minWidth: '140px' }}>姓名</th>
                                    <th style={{ minWidth: '220px' }}>信箱</th>
                                    <th style={{ minWidth: '100px' }} className="text-end">票券數量</th>
                                    <th style={{ minWidth: '100px' }} className="text-center">狀態</th>
                                    <th style={{ minWidth: '120px' }} className="text-center">操作</th>
                                    <th style={{ minWidth: '140px' }} className="text-center">詳細資訊</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pagedUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="text-center py-4">查無會員</td>
                                    </tr>
                                ) : (
                                    pagedUsers.map((user) => (
                                        <tr key={user.id}>
                                            <td>{user.id?.slice(0, 8)}</td>
                                            <td>{user.name}</td>
                                            <td>{user.email}</td>
                                            <td className='text-end'>{user.count}</td>
                                            <td className='text-center' >
                                                {user.isBlocked ? '封鎖' : '正常'}
                                            </td>
                                            <td className='text-center'>
                                                <button
                                                    className={`btn btn-sm ${user.isBlocked ? 'btn-success' : 'btn-danger'}`}
                                                    onClick={() => changeUserState(user.id)}
                                                >
                                                    {user.isBlocked ? '取消封鎖' : '封鎖'}
                                                </button>
                                            </td>
                                            <td className='text-center '>
                                                <button className="btn btn-sm btn-primary w-100">
                                                    查看詳細資訊
                                                </button>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>

                    <div className="mt-3 text-center">
                        <PaginationComponent
                            totalPages={totalPages}
                            currentPage={currentPage}
                            onPageChange={(page) => setCurrentPage(page)}
                        />
                    </div>
                </div>

            </div>
        </>
    );
}

export default UserManagementList;