import { useEffect, useState, useRef, PureComponent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { RadialBarChart, RadialBar, Legend, ResponsiveContainer } from 'recharts';
import axios from 'axios'

import Breadcrumb from "../../conponents/Breadcrumb";

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
        { name: `活動營收 / ${event.title}`, path: "/eventInfoDetail/:id" },
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

    // 轉換UTC時間(演出日期)
    function showTimeStartToEnd(start, end) {
        const startDate = new Date(start);
        const endDate = new Date(end);

        const year = startDate.getUTCFullYear();
        const month = String(startDate.getUTCMonth() + 1).padStart(2, '0');
        const day = String(startDate.getUTCDate()).padStart(2, '0');
        const startHour = String(startDate.getUTCHours()).padStart(2, '0');
        const startMinute = String(startDate.getUTCMinutes()).padStart(2, '0');
        const endHour = String(endDate.getUTCHours()).padStart(2, '0');
        const endMinute = String(endDate.getUTCMinutes()).padStart(2, '0');

        return `${year}-${month}-${day} ${startHour}:${startMinute} ～ ${endHour}:${endMinute}`;
    }

    // 轉換UTC時間(售票時間)
    function showTime(utcString) {
        const date = new Date(utcString);
        const year = date.getUTCFullYear();
        const month = String(date.getUTCMonth() + 1).padStart(2, '0');
        const day = String(date.getUTCDate()).padStart(2, '0');
        const hour = String(date.getUTCHours()).padStart(2, '0');
        const minute = String(date.getUTCMinutes()).padStart(2, '0');
        return `${year}-${month}-${day} ${hour}:${minute}`;
    }

    // 統計總票數、售出總票數、總收入、未售出票
    const totalQuantity = event.sections?.reduce((acc, section) => acc + section.quantity, 0) || 0;
    const totalSold = event.sections?.reduce((acc, section) => acc + section.sold_seats, 0) || 0;
    const totalAvailable = event.sections?.reduce((acc, section) => acc + section.available_seats, 0) || 0;
    const totalRevenue = event.sections?.reduce((acc, section) => acc + (section.sold_seats * section.price), 0) || 0;

    // 總售票率圖表
    const TicketSaleProgress = ({ saleRate }) => {
        const percent = saleRate * 100
        const data = [
            {
                name: 'all',
                value: 100,
                fill: '#E7E7E7'
            },
            {
                name: '售出票數',
                value: percent,
                fill: '#82ca9d'
            },
        ];

        return (
            <div style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="80%"
                        outerRadius="80%"
                        barSize={15}
                        startAngle={90}
                        endAngle={-270}
                        data={data}
                    >
                        <RadialBar
                            clockWise={false}
                            dataKey="value"
                            background={{ fill: "#E7E7E7" }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div style={{
                    textAlign: 'center',
                    marginTop: '-130px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    總售票率<br />{Math.round(percent)}%
                </div>

            </div>
        );
    };

    // 座位售票率圖表
    const SeatTicketSaleProgress = ({ saleRate, seatName, fillColor }) => {
        const percent = saleRate * 100
        const data = [
            {
                name: 'all',
                value: 100,
                fill: '#E7E7E7'
            },
            {
                name: `${seatName}區售出票數`,
                value: percent,
                fill: fillColor
            },
        ];

        return (
            <div style={{ width: 200, height: 200 }}>
                <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart
                        cx="50%"
                        cy="50%"
                        innerRadius="80%"
                        outerRadius="80%"
                        barSize={15}
                        startAngle={90}
                        endAngle={-270}
                        data={data}
                    >
                        <RadialBar
                            clockWise={false}
                            dataKey="value"
                            background={{ fill: "#E7E7E7" }}
                        />
                    </RadialBarChart>
                </ResponsiveContainer>

                <div style={{
                    textAlign: 'center',
                    marginTop: '-130px',
                    fontWeight: 'bold',
                    fontSize: '14px'
                }}>
                    {seatName}區售票率<br />{Math.round(percent)}%
                </div>

            </div>
        );
    };

    const colors = ['#8884d8', '#ffc658', '#ff8042', '#8dd1e1', '#C61408'];


    return (
        <>
            <div className="container py-3 px-md-5">

                <div className="nav eventInfo-nav">
                    <Breadcrumb className="nav-item" breadcrumbs={breadcrumb} />
                </div>


                <div className="border border-2 rounded p-3 mb-lg-5 mb-4">
                    <div className="d-flex flex-column flex-lg-row gap-3 align-items-center">
                        <img className="coverImg img-contain m-lg-0 m-auto" src={event.cover_image_url} alt={event.title || "活動封面"} style={{ height: '200px', width: '200px' }} />

                        <div className="">
                            <h3 className="mb-2 fw-bold">{event.title}</h3>
                            <div className="d-flex gap-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-Neutral-700" style={{ width: '70px' }}>舉辦方</p>
                                    <p className="text-Neutral-700">:</p>
                                </div>
                                <p className="fw-bold">{event.organizer}</p>
                            </div>
                            <div className="d-flex gap-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-Neutral-700" style={{ width: '70px' }}>演出日期</p>
                                    <p className="text-Neutral-700">:</p>
                                </div>
                                <p className="fw-bold">{showTimeStartToEnd(event.start_at, event.end_at)}</p>
                            </div>
                            <div className="d-flex gap-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-Neutral-700" style={{ width: '70px' }}>演出人員</p>
                                    <p className="text-Neutral-700">:</p>
                                </div>
                                <p className="fw-bold">{event.performance_group}</p>
                            </div>
                            <div className="d-flex gap-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-Neutral-700" style={{ width: '70px' }}>演出地點</p>
                                    <p className="text-Neutral-700">:</p>
                                </div>
                                <p className="fw-bold">{event.location}</p>
                            </div>
                            <div className="d-flex gap-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-Neutral-700" style={{ width: '70px' }}>演出類型</p>
                                    <p className="text-Neutral-700">:</p>
                                </div>
                                <p className="fw-bold">{event.type}</p>
                            </div>
                            <div className="d-flex gap-2 mb-2">
                                <div className="d-flex justify-content-between">
                                    <p className="text-Neutral-700" style={{ width: '70px' }}>售票時間</p>
                                    <p className="text-Neutral-700">:</p>
                                </div>
                                <div className="d-flex flex-column flex-sm-row gap-1">
                                    <p className="fw-bold">{showTime(event.sale_start_at)}</p>
                                    <p className="fw-bold text-center">～</p>
                                    <p className="fw-bold">{showTime(event.sale_end_at)}</p>
                                </div>
                            </div>

                        </div>

                        <div className="m-auto d-flex flex-column flex-lg-row align-items-center">
                            <TicketSaleProgress saleRate={parseFloat(event.sale_rate) || 0} />
                            <div>
                                <p>總票數 : {totalQuantity}</p>
                                <p>售出總票數 : {totalSold}</p>
                                <p>尚未售出張數 : {totalAvailable}</p>
                                <p>全部票券總收入 : NT${totalRevenue.toLocaleString()}</p>
                            </div>
                        </div>

                    </div>
                </div>

                <div className="border border-2 rounded p-3 mb-lg-5 mb-4">
                    <div className="border-bottom border-2 pb-3">
                        <h4 className="fw-bold">座位售票率</h4>
                    </div>
                    <div className="nav eventInfo-nav">
                        <div className="d-flex gap-4 p-2 ">
                            {event.sections?.map((section, index) => {
                                const color = colors[index % colors.length]
                                return (
                                    <div
                                        key={index}
                                        className="nav-item"
                                    >
                                        <SeatTicketSaleProgress
                                            seatName={section.section_name}
                                            saleRate={parseFloat(section.sold_seats / section.quantity) || 0}
                                            fillColor={color}
                                        />
                                        <p className="text">{section.section_name}區票券數量 : {section.quantity}</p>
                                        <p className="text">{section.section_name}區票券價格 : NT${section.price.toLocaleString()}</p>
                                        <p className="text">{section.section_name}區票券售出數量 : {section.sold_seats}</p>
                                        <p className="text">{section.section_name}區票券總收入 : NT${(section.price * section.sold_seats).toLocaleString()}</p>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>

                <div className="border border-2 rounded p-3 mb-lg-5 mb-4">
                    <div className="border-bottom border-2 pb-3">
                        <h4 className="fw-bold">票券販售圖表分析</h4>
                    </div>
                    <div className="nav eventInfo-nav">
                        <div className="d-flex gap-4 p-2 ">
                            <h2>圖表</h2>
                        </div>
                    </div>
                </div>


            </div>
        </>
    );
}

export default EventRevenue;