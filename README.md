# LumiTix 售票系統
LumiTix 是一個基於 Vite 構建的輕量級前端票務管理應用，旨在幫助活動主辦方便捷地管理票務系統，包括創建、分發、查詢和追蹤門票。這個專案使用現代化的 Web 技術，提供快速、流暢的體驗。

## 目錄
- 簡介
- 功能
- 安裝與設置
- 使用說明

## 簡介
LumiTix 是一個為活動主辦方和票務管理人員提供的工具，旨在簡化和自動化票務過程。其功能包括：
* **創建活動**：活動方可以方便地創建活動並生成票務。
* **票務查詢**：可以查看活動的票務狀態。
* **快速加載**：基於 Vite 開發，提供超快的開發和構建體驗。

本專案使用了 Vite 以及 React 作為構建工具，並且支持現代化的 JavaScript 和 CSS 特性。

## 功能
測試帳號密碼
- 使用者
```bash
帳號： test1@gmail.com
密碼： Abc123456
```
- 活動方
```bash
帳號： organizer@gmail.com
密碼： Abcd1234
```
- 平台方
```bash
帳號： admin@gmail.com
密碼： Abcd1234
```

## 安裝與設置
### 克隆專案並安裝依賴

以下將會引導你如何安裝此專案到你的電腦上。
Node.js 版本建議為：16.15.0 以上
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

## 使用說明
LumiTix 提供一個簡單的界面來創建和管理票務。主要功能包括：
1. **創建活動**：登錄後，活動方可以創建一個新活動，設置名稱、時間、票價等。
2. **查看票務**：查看當前活動的票務數量、狀態等信息。
3. **查詢票務狀態**：輸入票務代碼來查詢票務的有效性和狀態。
你可以在本地環境中運行專案，並進行測試。

## 專案技術
- Node.js v16.15.0
- Vite v5.4.0
- React v19.1.0
- Axios v1.9.0
- Bootstrap v5.3.3

## 資料夾說明
- src - 畫面以及樣式
  - assets - 圖片以及scss
  - conponent - 共用元件
  - context - 共用context
  - pages - 頁面
  - App.jsx - 管理頁面導向
