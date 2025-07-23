import { useEffect, useState, useRef } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import { useAuth } from '../contexts/AuthContext';
import {getEventInfo, newOrder} from '../api/user'
import Swal from 'sweetalert2';

// 元件
import Breadcrumb from "../conponents/Breadcrumb";
import Loading from "../conponents/Loading";
import InfoSection from "../conponents/InfoSection";


function Payments() {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();

    const [loading, setLoading] = useState(true);

    const isFirstRender = useRef(true); // 記錄是否是第一次渲染
    const { userToken, userRole } = useAuth();
    const [event, setEvent] = useState({})

    const [paymentMethod, setPaymentMethod] = useState("");
    const { sectionId, sectionName, price } = location.state || {};

    // 麵包屑
    const breadcrumb = [
        { name: '首頁', path: "/" },
        { name: '活動列表', path: "/allEvents" },
        { name: `${event.title}`, path: `/eventInfo/${id}` },
        { name: `購票`, path: `/eventInfo/${id}/payments` }
    ];

    // 防止直接貼上網址進入頁面
    useEffect(() => {
        if (!sectionId || !sectionName || !price) {
            Swal.fire({
                icon: 'warning',
                title: "尚未選擇票券區域，請重新選擇",
                confirmButtonText: `確認`,
            }).then(() => {
                navigate(`/eventInfo/${id}`);
            });
        }
    }, []);

    const [selectedArea, setSelectedArea] = useState({
        id: sectionId,
        section: sectionName,
        price_default: price,
    });

    const [quantity, setQuantity] = useState(1);

    // 總金額
    const total = selectedArea.price_default * quantity;

    // 取得單一活動資訊
    useEffect(() => {
        const fetchEvent = async () => {

            getEventInfo(id)
            .then(result => {
                setEvent(result.data || {});
            })
            .catch(err => {
                // console.error('取得活動失敗', err);
                Swal.fire({
                    icon: 'error',
                    title: '錯誤',
                    text: '無法取得活動資訊，請稍後再試',
                }).then(() => {
                    navigate('/allEvents');
                })
            })
            .finally (() =>{
                setLoading(false);
            })
        };

        if (isFirstRender.current) {
            isFirstRender.current = false;
            fetchEvent();
            // console.log(selectedArea)
        }
    }, []);

    // 注意事項
    const noticInfo = [
        "禁止攜帶外食與飲料入場。",
        "禁止攜帶專業攝影器材、錄音錄影設備。",
        "場館內禁止吸菸，請於指定區域內使用電子煙。",
        "若有任何身體不適，請立即向現場工作人員尋求協助。",
        "請遵守工作人員指示，保持演出秩序，尊重其他觀眾。",
    ];

    // 購票須知
    const buyTicketInfo = [
        "本演出門票僅限LumiTix販售，請勿透過非官方渠道購買，以免遭遇詐騙或無法入場。",
        "購票需註冊LumiTix帳號，請提前完成註冊，以便順利購票與查看票券。",
        "門票一經售出，恕不退換，請確認您的行程與訂單內容後再行購買。",
        "提醒：為確保您的權益，請務必妥善保管電子票券，不要將票券資訊洩漏給他人，以免遭到盜用。",
        "電子票券資訊：本場次採用電子票券，購票成功後，系統將寄送電子票券連結至您註冊的電子郵件信箱，或可直接登入 LumiTix 帳戶查看您的票券資訊。進場時，請準備好可連接網路的智慧型手機或平板，開啟電子票券並向現場工作人員出示入場畫面，驗證後即可入場。",
    ];

    // 回傳訂單
    const createOrder = async () => {
        
        const tickets = Array.from({ length: quantity }).map(() => ({
            section_id: selectedArea.id,
            quantity: 1,
        }));


        newOrder({
            event_id: id,
            tickets,
        })
        .then(result => {
            const { MerchantID, TradeInfo, TradeSha, Version } = result.data;
            sendToNewebPay({ MerchantID, TradeInfo, TradeSha, Version });
        })
        .catch(err => {
            const errMessage = err?.message || "購票失敗，請稍後再試";
            Swal.fire({
                icon: "error",
                title: '錯誤',
                text: errMessage,
            }).then(() => {
                navigate(`/eventInfo/${id}`);
            });
        })
        .finally (() =>{
            setLoading(false);
        })
           
    };

    // 前往藍星
    const sendToNewebPay = ({ MerchantID, TradeInfo, TradeSha, Version }) => {
        const form = document.createElement('form');
        form.method = 'POST';
        form.action = 'https://ccore.newebpay.com/MPG/mpg_gateway';

        const appendInput = (name, value) => {
            const input = document.createElement('input');
            input.type = 'hidden';
            input.name = name;
            input.value = value;
            form.appendChild(input);
        };

        appendInput('MerchantID', MerchantID);
        appendInput('TradeInfo', TradeInfo);
        appendInput('TradeSha', TradeSha);
        appendInput('Version', Version);

        document.body.appendChild(form);
        form.submit();
    };

    // 付款選項
    const PaymentOption = ({ id, value, checked, onChange, label }) => (
        <div className="form-check form-check-inline">
            <input
                className="form-check-input border-2 border-black"
                type="radio"
                name="paymentMethod"
                id={id}
                value={value}
                checked={checked}
                onChange={onChange}
            />
            <label className="form-check-label" htmlFor={id}>{label}</label>
        </div>
    )

    // 購票方式
    const PaymentMethod = ({ title, paymentMethod, setPaymentMethod }) => (
        <div className="mb-lg-7 mb-4 sectionTop">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
                <h5 className="text-white fw-bold">{title}</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-lg-4 px-3 py-lg-6 py-4">
                <PaymentOption
                    id="creditCard"
                    value="creditCard"
                    checked={paymentMethod === "creditCard"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    label="WebATM"
                />
                {/* <PaymentOption
                    id="linePay"
                    value="linePay"
                    checked={paymentMethod === "linePay"}
                    onChange={(e) => setPaymentMethod(e.target.value)}
                    disabled
                    label="linePay"
                /> */}
            </div>
        </div>
    )

    // 載入
    if (loading || !event) {
        return <Loading />
    }

    return (
        <div className="container">
            <div className="my-5 my-lg-8">
                <Breadcrumb breadcrumbs={breadcrumb} />

                <h2 className="mb-lg-7 mb-4 text-center">購票</h2>

                {/* 購票與訂單區塊 */}
                <div className="mb-lg-7 mb-4 align-items-center d-flex flex-column flex-lg-row gap-3">
                    {/* 購票區塊 */}
                    <div className="col card mb-3 border-0">
                        <div className="row g-0 align-items-center p-3">
                            <div className="col-md-4">
                                <img className="p-lg-0 p-1 w-100" src={event.cover_image_url} alt={event.title || "活動封面"} />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title mb-3">{event.title}</h5>
                                    <div className="d-flex justify-content-between align-items-center gap-2">
                                        <div className="d-flex gap-2 align-items-center">
                                            <p>{selectedArea.section} 區</p>
                                            <p className="mb-0">NT$ {selectedArea.price_default.toLocaleString()}</p>
                                        </div>
                                        <select
                                            className="form-select"
                                            style={{ maxWidth: '60px' }}
                                            value={quantity}
                                            onChange={(e) => setQuantity(Number(e.target.value))}
                                        >
                                            {Array.from(
                                                { length: Math.min(4, event.Section?.find(s => s.id === selectedArea.id)?.remainingSeats || 0) },
                                                (_, i) => i + 1
                                            ).map((num) => (
                                                <option key={num} value={num}>
                                                    {num}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                    <div className="d-flex justify-content-end gap-2 p-3">
                                        <h5>總計</h5>
                                        <p>NT$ {total.toLocaleString()}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* 訂單區塊 */}
                    <div className="col card mb-3 p-0 border-2 border-Neutral-700">
                        <div className="text-center py-3 bg-Neutral-700">
                            <h5 className="text-white fw-bold">購票訂單</h5>
                        </div>
                        <div className="g-0 p-3 row align-items-center">
                            <div className="col-md-4">
                                <img className="p-lg-0 p-1 w-100" src={event.cover_image_url} alt={event.title || "活動封面"} />
                            </div>
                            <div className="col-md-8">
                                <div className="card-body">
                                    <h5 className="card-title">{event.title}</h5>
                                    <div className="d-flex justify-content-between">
                                        <p className="card-text">
                                            <small className="text-body-secondary">{sectionName} 座位</small>
                                        </p>
                                        <p className="card-text">x {quantity}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="d-flex justify-content-end gap-2 p-3 border-top border-2">
                            <h5>總計</h5>
                            <p>NT$ {total.toLocaleString()}</p>
                        </div>
                    </div>

                </div>

                {/* 購票方式 */}
                <PaymentMethod title="購票方式" paymentMethod={paymentMethod} setPaymentMethod={setPaymentMethod} />

                {/* 注意事項 */}
                <InfoSection id="section" title="注意事項" items={noticInfo} />

                {/* 購票須知 */}
                <InfoSection id="section" title="購票須知" items={buyTicketInfo} />

                {/* 按鈕 */}
                <div className="d-flex flex-column flex-lg-row gap-4 col-6 mx-auto">
                    <button
                        className="col btn btn-secondary text-white fw-bold"
                        onClick={() => navigate(-1)}
                    >
                        返回頁面
                    </button>
                    <button
                        className="col btn btn-danger text-white fw-bold"
                        onClick={() => {
                            if (!paymentMethod) {
                                Swal.fire({
                                    icon: 'warning',
                                    title: '請選擇付款方式！',
                                });
                                return;
                            }

                            if (paymentMethod === "creditCard") {
                                // console.log({
                                //     ...selectedArea,
                                //     quantity,
                                // });
                                createOrder();
                            } else {
                                Swal.fire({
                                    icon: 'info',
                                    title: '目前只支援信用卡付款',
                                });
                            }
                        }}
                    >
                        立即付款
                    </button>
                </div>
            </div>
        </div>
    );
}

export default Payments;