import { useEffect, useState, useRef, PureComponent } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAuth } from '../../contexts/AuthContext';
import { ComposedChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadialBarChart, RadialBar, Legend } from 'recharts';
import Swal from 'sweetalert2';
import dayjs from "dayjs";
import utc from 'dayjs/plugin/utc';
import axios from 'axios';

import Breadcrumb from "../../conponents/Breadcrumb";

function EventRevenue() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { loading, userToken } = useAuth();
    const isFirstRender = useRef(true);
    const [apiLoading, setApiLoading] = useState(false);
    const [event, setEvent] = useState([])
    const [eventRevenue, setEventRevenue] = useState([])
    const [allOrders, setAllOrders] = useState([]);
    dayjs.extend(utc);

    const colors = ['#8884d8', '#83a6ed', '#8dd1e1', '#82ca9d', '#a4de6c', '#d0ed57', '#ffc658'];

    // 麵包屑
    const breadcrumb = [
        { name: '首頁', path: "/" },
        { name: '活動管理', path: "/eventsList" },
        { name: `活動營收 / ${event.title}`, path: "/eventInfoDetail/:id" },
    ];

    // 取得單一活動資訊
    useEffect(() => {
        const fetchData = async () => {
            try {
                const [eventRes, revenueRes] = await Promise.all([
                    axios.get(`https://n7-backend.onrender.com/api/v1/admin/events/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${userToken}`,
                        }
                    }),
                    axios.get(`https://n7-backend.onrender.com/api/v1/admin/events/revenue/${id}`, {
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Authorization': `Bearer ${userToken}`,
                        }
                    }),
                ]);

                setEvent(eventRes.data.data || []);
                setEventRevenue(revenueRes.data.data || []);
                // console.log('API eventRes 回傳資料:', eventRes.data.data)
                // console.log('API revenueRes 回傳資料:', revenueRes.data.data)
            } catch (err) {
                // console.error('取得資料失敗', err);
                Swal.fire({
                    icon: "error",
                    title: '錯誤',
                    text: "無法取得活動資訊，請稍後再試",
                }).then(() => {
                    navigate(`/eventsList`);
                });
            }
        };
        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchData();
        }
    }, []);

    // 取得單一活動所有訂單資訊
    useEffect(() => {
        if (!eventRevenue.sections) return;
        const res = eventRevenue.sections.flatMap(section =>
            section.orders.map(order => ({
                section: section.section_name,
                created_at: dayjs(order.created_at.replace('Z', '')).format("YYYY-MM-DD HH:mm"),
                quantity: order.quantity
            }))
        );
        setAllOrders(res);
    }, [eventRevenue]);

    // 轉換UTC時間(演出日期)
    function showTimeStartToEnd(start, end) {
        const startTime = dayjs.utc(start).format("YYYY-MM-DD HH:mm");
        const endTime = dayjs.utc(end).format("HH:mm");
        return `${startTime} ～ ${endTime}`;
    }

    // 轉換UTC時間(售票時間)
    function showSaleTime(startSale, endSale) {
        const startTime = dayjs.utc(startSale).format("YYYY-MM-DD HH:mm");
        const endTime = dayjs.utc(endSale).format("YYYY-MM-DD HH:mm");
        return `${startTime} ～ ${endTime}`;
    }

    // 活動資訊欄
    const EventInfoRow = ({ label, value }) => {
        return (
            <div className="d-flex gap-2 mb-2">
                <div className="d-flex justify-content-between">
                    <p className="text-Neutral-700" style={{ width: '70px' }}>{label}</p>
                    <p className="text-Neutral-700">:</p>
                </div>
                <p className="fw-bold">{value}</p>
            </div>
        );
    }

    // 總票數、售出總票數、尚未售出張數、全部票券總收入
    const totalQuantity = event.sections?.reduce((acc, section) => acc + section.quantity, 0) || 0;
    const totalSold = event.sections?.reduce((acc, section) => acc + section.sold_seats, 0) || 0;
    const totalAvailable = event.sections?.reduce((acc, section) => acc + section.available_seats, 0) || 0;
    const totalRevenue = event.sections?.reduce((acc, section) => acc + (section.sold_seats * section.price), 0) || 0;

    // 總售票率圖表
    const TotalTicketSalePieChart = ({ saleRate, totalQuantity, totalSold, totalAvailable, totalRevenue }) => {
        const percent = saleRate * 100;
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
            <div className="m-auto d-flex flex-column align-items-center">
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
                        總售票率<br />{percent.toFixed(2)}%
                    </div>
                </div>

                <div className="ms-lg-4 mt-4 mt-lg-0">
                    <p>總票數 : {totalQuantity} 張</p>
                    <p>售出總票數 : {totalSold} 張</p>
                    <p>尚未售出票數 : {totalAvailable} 張</p>
                    <p>全部票券總收入 : NT$ {totalRevenue.toLocaleString()}</p>
                </div>
            </div>
        );
    }

    // 座位售票率圖表
    const SeatTicketSalePieChart = ({ section, fillColor }) => {
        const percent = (section.sold_seats / section.quantity) * 100 || 0;

        const data = [
            {
                name: 'all',
                value: 100,
                fill: '#E7E7E7'
            },
            {
                name: `${section.section_name}區售出票數`,
                value: percent,
                fill: fillColor
            },
        ];

        return (
            <div className="nav-item">
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
                        {section.section_name}區售票率<br />{percent.toFixed(2)}%
                    </div>
                </div>

                <p className="text">{section.section_name}區票券數量 : {section.quantity} 張</p>
                <p className="text">{section.section_name}區票券價格 : NT$ {section.price.toLocaleString()}</p>
                <p className="text">{section.section_name}區票券售出 : {section.sold_seats} 張</p>
                <p className="text">{section.section_name}區票券收入 : NT$ {(section.price * section.sold_seats).toLocaleString()}</p>
            </div>
        );
    };

    // 票券銷售圖表
    const TicketSalesChart = ({ event, allOrders, colors }) => {

        const saleStart = dayjs((event.sale_start_at || "").replace('Z', ''));
        const saleEnd = dayjs((event.sale_end_at || "").replace('Z', ''));

        // 建立日期區間
        function getDateRange(start, end) {
            const range = [];
            let curr = start.startOf('day');
            while (curr.isBefore(end) || curr.isSame(end, 'day')) {
                range.push(curr.format("MM-DD"));
                curr = curr.add(1, 'day');
            }
            return range;
        }
        const dateRange = getDateRange(saleStart, saleEnd);

        // 取得活動所有票區
        const sections = event.sections?.map(s => s.section_name) || [];
        const sectionDailyData = {};
        sections.forEach(section => {
            sectionDailyData[section] = {};
            dateRange.forEach(date => {
                sectionDailyData[section][date] = 0;
            });
        });

        // 累積各票區每日總銷售數量
        allOrders.forEach(order => {
            const createdDate = dayjs(order.created_at).format("MM-DD");
            const section = order.section;

            if (sectionDailyData[section] && sectionDailyData[section][createdDate] != null) {
                sectionDailyData[section][createdDate] += order.quantity
            }
        });
        // 組成圖表所需陣列資料
        const chartData = dateRange.map(date => {
            const dataPoint = { date };
            sections.forEach(section => {
                dataPoint[`${section}_daily`] = sectionDailyData[section][date] || 0;
            });
            return dataPoint;
        });

        // 累積銷售數
        sections.forEach(section => {
            let cumulative = 0;
            chartData.forEach(point => {
                cumulative += point[`${section}_daily`];
                point[`${section}_cumulative`] = cumulative;
            });
        });

        const MaxQuantity = event.sections?.reduce((acc, section) => acc + section.quantity, 0) || 0;
        const Style = {
            top: '50%',
            right: -150,
            transform: 'translate(0, -50%)',
            lineHeight: '24px',
        };

        return (
            <div className="border border-3 rounded p-3 mb-lg-5 mb-4">
                <div className="border-bottom border-2 pb-3">
                    <h4 className="fw-bold">票券販售圖表分析</h4>
                </div>
                <div className="nav eventInfo-nav">
                    <div className="d-flex gap-4 p-2 ">
                        <div style={{ width: 1000, height: 500 }}>
                            <ResponsiveContainer width="100%" height={500}>
                                <ComposedChart
                                    data={chartData}
                                    margin={{ top: 20, right: 30, left: 0, bottom: 0 }}
                                >
                                    <CartesianGrid stroke="#E7E7E7" />
                                    <XAxis dataKey="date" />
                                    <YAxis domain={[0, MaxQuantity]} />
                                    <Tooltip />
                                    <Legend iconSize={10} layout="vertical" verticalAlign="middle" wrapperStyle={Style} />

                                    {sections.map((section, index) => (
                                        <Bar
                                            key={`${section}-bar`}
                                            dataKey={`${section}_daily`}
                                            name={`${section} 區 - 當日銷售`}
                                            stackId="all"
                                            fill={colors[index % colors.length]}
                                        />
                                    ))}

                                    {sections.map((section, index) => (
                                        <Line
                                            key={`${section}-line`}
                                            type="monotone"
                                            dataKey={`${section}_cumulative`}
                                            name={`${section} 區 - 累積銷售`}
                                            stroke={colors[index % colors.length]}
                                            strokeWidth={2}
                                            dot={false}
                                        />
                                    ))}
                                </ComposedChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>
            </div>
        );
    };

    return (
        <>
            <div className="container py-3 px-md-5">

                <div className="nav eventInfo-nav">
                    <Breadcrumb className="nav-item" breadcrumbs={breadcrumb} />
                </div>

                <div className="border border-3 rounded p-3 mb-lg-5 mb-4">
                    <div className="d-flex flex-column flex-lg-row gap-3 align-items-center">

                        <img className="coverImg img-contain m-lg-0 m-auto" src={event.cover_image_url} alt={event.title || "活動封面"} style={{ height: '200px', width: '200px' }} />

                        <div className="">
                            <h3 className="mb-2 fw-bold">{event.title}</h3>
                            {/* 活動資訊欄 */}
                            <EventInfoRow label="舉辦方" value={event.organizer} />
                            <EventInfoRow label="演出日期" value={showTimeStartToEnd(event.start_at, event.end_at)} />
                            <EventInfoRow label="演出人員" value={event.performance_group} />
                            <EventInfoRow label="演出地點" value={event.location} />
                            <EventInfoRow label="演出類型" value={event.type} />
                            <EventInfoRow label="售票時間" value={showSaleTime(event.sale_start_at, event.sale_end_at)} />
                        </div>

                        {/* 總售票率圖表 */}
                        <TotalTicketSalePieChart
                            saleRate={parseFloat(event.sale_rate) || 0}
                            totalQuantity={totalQuantity}
                            totalSold={totalSold}
                            totalAvailable={totalAvailable}
                            totalRevenue={totalRevenue}
                        />

                    </div>
                </div>

                <div className="border border-3 rounded p-3 mb-lg-5 mb-4">
                    <div className="border-bottom border-2 pb-3">
                        <h4 className="fw-bold">座位售票率</h4>
                    </div>
                    <div className="nav eventInfo-nav">
                        <div className="d-flex gap-4 p-2 ">
                            {/* 座位售票率圖表 */}
                            {event.sections?.map((section, index) => (
                                <SeatTicketSalePieChart
                                    key={index}
                                    section={section}
                                    fillColor={colors[index % colors.length]}
                                />
                            ))}
                        </div>
                    </div>
                </div>

                {/* 票券銷售圖表 */}
                <TicketSalesChart
                    event={event}
                    allOrders={allOrders}
                    colors={colors}
                />
            </div>
        </>
    );
}

export default EventRevenue;