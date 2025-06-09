import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import axios from 'axios'

import Breadcrumb from "../../conponents/Breadcrumb";
import PaginationComponent from "../../conponents/Pagination";

function EventRevenue() {
    const { id } = useParams();

    const { loading, userToken } = useAuth();
    const isFirstRender = useRef(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [event, setEvent] = useState([])

    // 麵包屑
    const breadcrumb = [
        { name: '首頁', path: "/" },
        { name: '活動管理', path: "/eventsList" },
        { name: `${event.title}`, path: "/eventInfoDetail/:id" },
    ];

    // 取得單一活動資訊
    useEffect(() => {
        const fetchEvent = async () => {
            try {
                const res = await axios.get(`https://n7-backend.onrender.com/api/v1/admin/events/${id}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    }
                })

                setApiLoading(false)
                setEvent(res.data.data || [])
                console.log('API 回傳資料:', res.data.data)
            } catch (err) {
                setApiLoading(false)
                console.error('取得使用者失敗', err)
                navigate('/ErrorPage')
            }
        }

        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchEvent();
        }
    }, []);


    return (
        <>
            <div className="container py-3 px-md-5">

                <Breadcrumb breadcrumbs={breadcrumb} />

                <h1>{event.title}</h1>




            </div>
        </>
    );
}

export default EventRevenue;