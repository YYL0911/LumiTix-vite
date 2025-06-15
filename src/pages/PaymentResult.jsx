import { useEffect, useState, useRef } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import axios from 'axios';

import Loading from "../conponents/Loading";

function CreatOrder() {
    const { id: orderId } = useParams();
    const navigate = useNavigate();
    const { id } = useParams();

    const isFirstRender = useRef(true);
    const [apiLoading, setApiLoading] = useState(false);
    const { userToken } = useAuth();

    const [order, setOrder] = useState(null);
    dayjs.extend(utc);

    // 轉換UTC時間
    function showTime(utcTime) {
        return dayjs.utc(utcTime).format("YYYY-MM-DD HH:mm");
    }

    // 取得單一訂單資料
    useEffect(() => {
        const fetchOrder = async () => {
            setApiLoading(true);
            try {
                const res = await axios.get(`https://n7-backend.onrender.com/api/v1/orders/${orderId}`, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Authorization': `Bearer ${userToken}`,
                    },
                });
                setApiLoading(false);
                if (res.data.status) {
                    setOrder(res.data.data || {});
                    // console.log('API 回傳資料:', res.data.data);
                }
            } catch (err) {
                setApiLoading(false);
                // console.error('取得訂單失敗', err);
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: '無法取得訂單資訊，請確認是否購買成功',
                }).then(() => {
                    navigate('/tickets');
                })
            }
        };

        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchOrder();
        }
    }, [orderId, userToken]);

    // 載入
    if (apiLoading || !order) {
        return <Loading />
    }

    return (
        <>
            <div className="bg-secondary">
                <div className="container cover-width">
                    <img className="w-100" src={order.event?.cover_image_url} alt="活動封面" />
                </div>
            </div>

            <div className="container">
                <div className="my-4 my-lg-5">
                    <div className="mb-lg-7 mb-4">
                        <h2 className="fw-bold text-success text-center">付款成功</h2>
                    </div>

                    {/* 訂單資訊 */}
                    <div className="mb-lg-7 mb-4">
                        <div className="col card mb-3 p-0 border-2 border-Neutral-700 order-width m-auto">
                            <div className="text-center py-3 bg-Neutral-700">
                                <h5 className="text-white fw-bold">訂單資訊</h5>
                            </div>
                            <div className="p-3">
                                <dl className="row mb-0">
                                    <dt className="col-sm-2">訂單編號</dt>
                                    <dd className="col-sm-9">{order?.order_no}</dd>

                                    <dt className="col-sm-2">活動名稱</dt>
                                    <dd className="col-sm-9">{order?.event?.title}</dd>

                                    <dt className="col-sm-2">演出日期</dt>
                                    <dd className="col-sm-9">{showTime(order?.event?.start_at)}</dd>

                                    <dt className="col-sm-2">活動地點</dt>
                                    <dd className="col-sm-9">{order?.event?.location}</dd>

                                    <dt className="col-sm-2">座位</dt>
                                    <dd className="col-sm-9 d-flex gap-2">
                                        {order?.tickets?.map((ticket, index) => (
                                            <p key={index}>{ticket.seat_no}({ticket.type})</p>
                                        ))}
                                    </dd>

                                    <dt className="col-sm-2">總計</dt>
                                    <dd className="col-sm-9">
                                        NT$ {order?.tickets?.reduce((sum, ticket) => sum + ticket.price, 0).toLocaleString()}
                                    </dd>

                                    <dt className="col-sm-2">付款狀態</dt>
                                    <dd className="col-sm-9">{order?.payment_status === "paid" ? "已付款" : "未付款"}</dd>
                                </dl>
                            </div>

                            <div className="p-3 border-top border-2">
                                <div className="d-flex flex-column flex-lg-row gap-4 col-6 mx-auto">
                                    <Link className="nav-link col btn p-2 bg-secondary text-white fw-boldr" to='/'>返回首頁</Link>
                                    <Link className="nav-link col btn p-2 bg-danger text-white fw-boldr" to={`/ticketInfo/${id}`}>查看票券</Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default CreatOrder;