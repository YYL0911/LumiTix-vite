import { useParams } from "react-router-dom";
import Breadcrumb from "../conponents/Breadcrumb";

const testData = {
  "status": "",             // 結果 boolean
  "message": "",            // 回傳訊息  
  "event_id": "",           // UUID
  "title": "",              // varchar
  "location": "",           // varchar
  "address": "",            // varchar
  "start_at": "",           // timestamp
  "end_at": "",             // timestamp
  "sale_start_at": "",      // timestamp
  "sale_end_at": "",        // timestamp
  "perform_group": "",      // varchar
  "discription": "",        // text
  "cast": "",               // varchar(320)
  "body": "",               // text
  "cover_Image": "",        // url
  "section_Image": "",      // url
  "type": true,             // boolean
  "event_status": "",       // varchar
  "created_at": "",         // timestamp
  "updated_at": "",         // timestamp
  "check_at": "",           // timestamp
  "user_id": ""             // UUID
}


function EventInfo() {

  const { id } = useParams();

  // 麵包屑
  const breadcrumb = [
    { name: '首頁', path: "/" },
    { name: '活動列表', path: "/allEvents" },
    { name: `活動名稱` }
  ];

  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <>
      <div className="container">
        <div className="m-xy-1 ">

          <Breadcrumb breadcrumbs={breadcrumb} />

          <div className="border border-2 border-black p-7 mb-4">
            <img src="https://fakeimg.pl/996x560/?text=test" alt="test" />
          </div>

          <div className="d-flex justify-content-between mb-8 align-items-center">
            <h1 className="fw-bold">活動名稱</h1>
            <button className="border-0 py-3 px-4">
              <p className="text-Neutral-300">尚未開賣</p>
            </button>
          </div>


          <ul className="nav border border-2 border-black p-2 mb-7">
            <div className="d-flex gap-2">
              <li className="nav-item border-bottom border-3">
                <p className="nav-link text-black" onClick={() => scrollToSection('section1')}>活動詳情</p>
              </li>
              <li className="nav-item">
                <a className="nav-link text-black" onClick={() => scrollToSection('section2')}>注意事項</a>
              </li>
              <li className="nav-item">
                <a className="nav-link text-black" onClick={() => scrollToSection('section3')}>購票須知</a>
              </li>
              <li className="nav-item">
                <p className="nav-link text-black" onClick={() => scrollToSection('section4')}>票券區域</p>
              </li>
            </div>
          </ul>

          <div className="mb-7" id="section1">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">活動詳情</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-4 py-6">
              <div className="d-flex flex-column gap-6">

                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出日期</p>
                  <p className="fw-bold">2025年8月16日（六）19:30（18:00 開放入場）</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出人員</p>
                  <p className="fw-bold">MOSAIC BAND</p>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出地點</p>
                  <div>
                    <p className="fw-bold text-end">台北小巨蛋（Taipei Arena）</p>
                    <p className="fw-bold text-end">台北市松山區南京東路四段2號</p>
                  </div>
                </div>
                <div className="d-flex justify-content-between">
                  <p className="text-Neutral-700">演出類型</p>
                  <p className="fw-bold">演唱會</p>
                </div>
              </div>
              <div className="border-2 border-top border-Neutral-700 my-6"></div>
              <div>
                <p>活動介紹...</p>
              </div>

            </div>
          </div>

          <div className="mb-7" id="section2">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">注意事項</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-4 py-6">
              <ul className="d-flex flex-column gap-6 mb-0">
                <li>禁止攜帶外食與飲料入場。</li>
                <li>禁止攜帶專業攝影器材、錄音錄影設備。</li>
                <li>場館內禁止吸菸，請於指定區域內使用電子煙。</li>
                <li>若有任何身體不適，請立即向現場工作人員尋求協助。</li>
                <li>請遵守工作人員指示，保持演出秩序，尊重其他觀眾。</li>
              </ul>
            </div>
          </div>

          <div className="mb-7" id="section3">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">購票須知</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-4 py-6">
              <ul className="d-flex flex-column gap-6 mb-0">
                <li>本演出門票僅限LumiTix販售，請勿透過非官方渠道購買，以免遭遇詐騙或無法入場。</li>
                <li>購票需註冊LumiTix帳號，請提前完成註冊，以便順利購票與查看票券。</li>
                <li>門票一經售出，恕不退換，請確認您的行程與訂單內容後再行購買。</li>
                <li>提醒：為確保您的權益，請務必妥善保管電子票券，不要將票券資訊洩漏給他人，以免遭到盜用。</li>
                <li>電子票券資訊：本場次採用電子票券，購票成功後，系統將寄送電子票券連結至您註冊的電子郵件信箱，或可直接登入 LumiTix 帳戶查看您的票券資訊。進場時，請準備好可連接網路的智慧型手機或平板，開啟電子票券並向現場工作人員出示入場畫面，驗證後即可入場。</li>
              </ul>
            </div>
          </div>

          <div className="mb-7" id="section4">
            <div className="border border-2 border-Neutral-700 px-4 py-3 bg-Neutral-700">
              <h5 className="text-white fw-bold">票券區域</h5>
            </div>
            <div className="border border-2 border-top-0 border-Neutral-700 px-4 py-6">
              <div className="d-flex gap-6">
                <img src="https://fakeimg.pl/498x618/?text=test" alt="test" />
                <div className="w-100">
                  <div className="px-3 py-2 bg-Primary-50">
                    <div className="d-flex justify-content-between fw-bold">
                      <p className="text-Primary-900">距離開賣</p>
                      <div className="d-flex gap-2 text-Primary-700 fw-bold">
                        <p>62</p>
                        <p>:</p>
                        <p>15</p>
                        <p>:</p>
                        <p>24</p>
                        <p>:</p>
                        <p>13</p>
                      </div>
                    </div>
                  </div>

                  <div className="d-flex align-items-center justify-content-between my-4">
                    <div className="d-flex gap-3">
                      <p className="text-Neutral-700">A區</p>
                      <p className="fw-bold">NT$ 2,500</p>
                    </div>
                    <button className="border-0 py-2 px-3">
                      <p className="fw-bold text-Neutral-300">尚未開賣</p>
                    </button>
                  </div>
                  <div className="border-2 border-top border-Neutral-700"></div>

                  <div className="d-flex align-items-center justify-content-between my-4">
                    <div className="d-flex gap-3">
                      <p className="text-Neutral-700">B區</p>
                      <p className="fw-bold">NT$ 2,500</p>
                    </div>
                    <button className="border-0 py-2 px-3">
                      <p className="fw-bold text-Neutral-300">尚未開賣</p>
                    </button>
                  </div>
                  <div className="border-2 border-top border-Neutral-700"></div>

                  <div className="d-flex align-items-center justify-content-between my-4">
                    <div className="d-flex gap-3">
                      <p className="text-Neutral-700">B1區</p>
                      <p className="fw-bold">NT$ 2,500</p>
                    </div>
                    <button className="border-0 py-2 px-3">
                      <p className="fw-bold text-Neutral-300">尚未開賣</p>
                    </button>
                  </div>
                  <div className="border-2 border-top border-Neutral-700"></div>

                  <div className="d-flex align-items-center justify-content-between my-4">
                    <div className="d-flex gap-3">
                      <p className="text-Neutral-700">B2區</p>
                      <p className="fw-bold">NT$ 2,500</p>
                    </div>
                    <button className="border-0 py-2 px-3">
                      <p className="fw-bold text-Neutral-300">尚未開賣</p>
                    </button>
                  </div>
                  <div className="border-2 border-top border-Neutral-700"></div>

                  <div className="d-flex align-items-center justify-content-between my-4">
                    <div className="d-flex gap-3">
                      <p className="text-Neutral-700">C區</p>
                      <p className="fw-bold">NT$ 2,500</p>
                    </div>
                    <button className="border-0 py-2 px-3">
                      <p className="fw-bold text-Neutral-300">尚未開賣</p>
                    </button>
                  </div>
                  <div className="border-2 border-top border-Neutral-700"></div>

                  <div className="d-flex align-items-center justify-content-between my-4">
                    <div className="d-flex gap-3">
                      <p className="text-Neutral-700">D區</p>
                      <p className="fw-bold">NT$ 2,500</p>
                    </div>
                    <button className="border-0 py-2 px-3">
                      <p className="fw-bold text-Neutral-300">尚未開賣</p>
                    </button>
                  </div>

                </div>
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  );
}

export default EventInfo;
