import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AICompanion = () => {
  const navigate = useNavigate(); // 用於點擊卡片後跳轉頁面
  const [isOpen, setIsOpen] = useState(false); // 控制聊天視窗是否開啟
  const [messages, setMessages] = useState([{ sender: "ai", text: "您好！想找什麼樣的活動呢？試著問我看看吧！" }]);
  const [query, setQuery] = useState(""); // 儲存使用者在輸入框中打的字
  const [isLoading, setIsLoading] = useState(false); // 管理是否正在等待後端回應
  const messagesEndRef = useRef(null); // 建立一個 Ref，指向訊息列表的末端，用於自動滾動

  // 這個 effect 負責在 messages 陣列更新時，自動將聊天視窗滾動到底部
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, isOpen]); // 當 messages 或 isOpen 改變時觸發
  
  // 這個 effect 專門用來鎖定背景滾動
  useEffect(() => {
    // 當 isOpen 狀態變為 true (視窗打開) 時
    if (isOpen) {
      // 為 body 加上 style，禁止滾動
      document.body.style.overflow = "hidden";
    }
    // 這個 effect 的「清除函式 (cleanup function)」
    return () => {
      // 當元件卸載或 isOpen 變為 false (視窗關閉) 時，恢復 body 的滾動功能
      document.body.style.overflow = "auto";
    };
  }, [isOpen]); // 這個 effect 只監聽 isOpen 狀態的變化

  // 事件處理函式 - 處理搜尋
  const handleSearch = async (e) => {
    e.preventDefault(); // 防止表單提交時頁面重新整理
    if (!query.trim()) return; // 如果輸入是空白，則不執行任何動作

    // --- 使用者體驗優化：立即顯示使用者輸入的訊息 ---
    const userMessage = { sender: "user", text: query };
    setMessages((prev) => [...prev, userMessage]); // 將使用者的問題加入對話紀錄
    setQuery(""); // 清空輸入框
    setIsLoading(true); // 進入等待狀態，禁用輸入框和按鈕
    // --- 核心 API 呼叫 ---
    try {
      const response = await axios.post("https://n7-backend.onrender.com/api/v1/ai-search", { query });
      const aiResponse = {
        sender: "ai",
        text: response.data.message, // AI 的對話文字
        data: response.data.data, // 活動列表陣列
      };
      setMessages((prev) => [...prev, aiResponse]);
    } catch (error) {
      const errorMessage = { sender: "ai", text: "抱歉，我現在有點忙不過來，請稍後再試一次。", error: true };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false); // 無論成功或失敗，最後都結束等待狀態
    }
  };
  // 如果視窗是關閉的，只顯示浮動按鈕
  if (!isOpen) {
    return (
      <div className="ai-companion-widget">
        <button className="btn btn-danger bg-gradient floating-button shadow-lg" onClick={() => setIsOpen(true)}>
          <i className="bi bi-headset"></i>
        </button>
      </div>
    );
  }
  // 如果視窗是開啟的，顯示完整的聊天介面
  return (
    <div className="ai-companion-widget">
      <div className="chat-window">
        {/* 標題列 */}
        <div
          className="p-3 bg-dark text-white d-flex justify-content-between align-items-center"
          style={{ borderTopLeftRadius: "15px", borderTopRightRadius: "15px" }}
        >
          <h5 className="mb-0">AI 活動小幫手</h5>
          <button
            type="button"
            className="btn-close btn-close-white"
            aria-label="Close"
            onClick={() => setIsOpen(false)}
          ></button>
        </div>

        {/* 訊息顯示區 */}
        <div className="flex-grow-1 p-3" style={{ overflowY: "auto", backgroundColor: "#f8f9fa" }}>
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`mb-3 d-flex ${msg.sender === "user" ? "justify-content-end" : "justify-content-start"}`}
            >
              <div
                className={`p-2 rounded shadow-sm ${msg.sender === "user" ? "bg-dark text-white" : "bg-light border"}`}
                style={{ maxWidth: "80%" }}
              >
                {/* 顯示對話文字 */}
                {msg.text}
                {/* 如果這則是 AI 的回覆，且包含活動資料(data)，就渲染活動卡片 */}
                {msg.sender === "ai" && msg.data && msg.data.length > 0 && (
                  <div className="mt-2">
                    {msg.data.map((event) => (
                      // 將每一張卡片都變成可以點擊的按鈕，並觸發導覽到活動詳情頁
                      <div
                        key={event.id}
                        className="card mb-2 ai-result-card"
                        onClick={() => {
                          navigate(`/eventInfo/${event.id}`);
                          setIsOpen(false); // 點擊後自動關閉視窗
                        }}
                      >
                        {event.cover_image_url && (
                          <img src={event.cover_image_url} className="card-img-top" alt={event.title} />
                        )}
                        <div className="card-body p-2 text-dark">
                          <h6 className="card-title mb-0">{event.title}</h6>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}
          {/* 這個隱形的 div，是讓上面 useEffect 可以滾動到的目標 */}
          <div ref={messagesEndRef} />
        </div>

        {/* 輸入區 */}
        <div className="p-3 border-top">
          <form onSubmit={handleSearch}>
            <div className="d-flex gap-2 align-items-center">
              <input
                type="text"
                className="form-control"
                placeholder="試著問我：下週末的演唱會"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                disabled={isLoading}
                autoFocus
              />
              <button className="btn btn-danger bg-gradient flex-shrink-0" type="submit" disabled={isLoading}>
                {isLoading ? "思考中..." : "發送"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AICompanion;
