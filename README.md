# LumiTix 售票系統
LumiTix 是一個基於 Vite 構建的輕量級前端票務管理應用，旨在幫助活動主辦方便捷地管理票務系統，包括創建、分發、查詢和追蹤門票。這個專案使用現代化的 Web 技術供快速、流暢的體驗。
使用 React + Vite 打造，搭配 Bootstrap 美化介面。

## 目錄
- 簡介
- 快速連結
- 功能
- 安裝與設置
- 專案技術
- 資料夾說明
- 聯絡資訊

## 簡介
> 本專案使用了 Vite 以及 React 作為構建工具，並且支持現代化的 JavaScript 和 CSS 特性。
- 台灣藝文活動蓬勃發展，無論是大型演唱會、小型音樂表演或各類文化展演，都面臨著相同的票務挑戰：缺乏一個專為台灣市場設計的、整合性強且使用者體驗佳的票務平台。
我們希望為台灣的藝文活動提供更加便捷、安全和高效的票務服務。
作品願景為成為連結藝文活動與觀眾的橋樑，為活動主辦方提供強大的票務工具，為觀眾提供優質的購票體驗，最終促進台灣藝文活動的繁榮發展。

## 快速連結
- 網站前台：https://yyl0911.github.io/LumiTix-vite/
- 後端gitHub repo：https://github.com/bingss/N7_Backend
- Api路徑：https://n7-backend.onrender.com/


## 功能
> 你可以在本地環境中運行專案，並進行測試。
### 使用者
```bash
帳號：test1@gmail.com
密碼：Abc123456
```
-  **註冊帳號並登入**：可使用Google或帳號密碼進行註冊登入。
-  **查看活動**：
   - 看當前活動的時間、地點等信息。
   - 根據地點、時間、活動類型以及關鍵字來搜尋想要的活動。
-  **查詢票務狀態**：查詢票務的有效性和狀態。
-  **會員系統**：
   - 修改名稱
   - 修改密碼
   - 綁定第三方平台
-  **購票**：藍新金流進行付費
  > 選擇好欲購買的票卷以及張數後，可參考下圖步驟進行藍新金流付費
   ![Picture](https://drive.google.com/uc?export=view&id=1DETXYK04eO2Vp5e2I6kAtV4EWOhLDCJn)

### 活動方
```bash
帳號：organizer@gmail.com
密碼：Abcd1234
```
-  **活動票券銷售**：
   - 查看當前活動的銷售信息。
   - 根據地點、時間、活動類型以及關鍵字來搜尋想要的活動。
-   **驗票**：在入場時掃QRcode，將票券狀態改為已使用
-  **新增活動**：新增要舉辦活動。
   - 活動資訊建立與編輯。
   - 票種與價格設定。
     
### 平台方
```bash
帳號：admin@gmail.com
密碼：Abcd1234
```
-  **管理使用者帳號**：
   - 可使封鎖有疑慮或不法之帳號。
   - 查看會員購票詳細資訊
-  **活動資訊**：
   - 審核活動。
   - 查看活動銷售與收入

## 安裝與設置
### 克隆專案並安裝依賴

以下將會引導你如何安裝此專案到你的電腦上。
Node.js 版本建議為：16.15.0 以上，
Ｖite版本建議為：5.4.0 以上

```bash
git clone https://github.com/YYL0911/LumiTix-vite.git
cd LumiTix-vite
npm install
```

### 運行專案：

```bash
npm run dev
```

### 開啟專案：
```bash
http://localhost:5173。
```

## 打包生產版本
```bash
npm run build
```
此命令會將應用打包為生產環境的靜態資源。


## 專案技術
- Node.js v16.15.0
- Vite v5.4.0
- React v19.1.0
- Axios v1.9.0
- Bootstrap v5.3.3
- 樣式 scss
- 表單處理: React Hook Form 7

## 資料夾說明
- src - 畫面以及樣式
  - assets - 圖片以及scss
  - conponent - 共用元件
  - context - 共用context
  - pages - 頁面
  - App.jsx - 管理頁面導向
 
## 聯絡資訊
> 以下為製作團隊GitHub
- YYL：https://github.com/YYL0911
- sain：https://github.com/bingss
- Carson：https://github.com/Carson0220
- LKP：https://github.com/LKP0617
- Mos：https://github.com/mos25399
