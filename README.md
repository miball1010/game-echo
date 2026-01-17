# 遊戲回聲｜GameEcho
GameEcho 是一個個人遊戲收藏與管理平台，使用者可以：

- 記錄自己的遊戲清單與進度  
- 按遊戲狀態與分類進行篩選，方便管理大量遊戲  
- 高自由度紀錄遊戲資料（名稱、圖片、平台、進度、筆記、分類、開始及完成時間）  

本專案使用 Vue 3 + Pinia + Firebase 架構，提供簡潔且響應式的使用體驗。

---

## 功能特性

- **遊戲管理**  
  - 新增 / 編輯 / 刪除遊戲  
  - 可自由新增平台與分類  
  - 記錄遊戲開始與完成時間  

- **篩選與搜尋**  
  - 按遊戲狀態分類：已通關、遊玩中、暫停、待遊玩  
  - 搜尋文字篩選遊戲  

- **滾動式渲染**  
  - 遊戲清單支持懶加載，提升大量資料渲染性能  

- **Firebase 即時資料同步**  
  - 登入狀態改變自動同步遊戲資料  

- **使用者驗證**  
  - Email / 密碼登入註冊  
  - 忘記密碼與重設  

---

## 技術棧

| 模組 | 技術 |
| ---- | ---- |
| 前端框架 | Vue 3 + TypeScript + Vite |
| 狀態管理 | Pinia |
| 後端服務 | Firebase Firestore + Firebase Auth |
| 部署 | GitHub Pages |

---

## 專案結構
```
game-echo/
├── src/
│   ├── assets/          
│   ├── components/       
│   │   ├── game/         
│   │   │   ├── GameCard.vue # 遊戲資料
│   │   │   ├── GameCardBox.vue # 遊戲資料外層
│   │   │   └── EditGameModal.vue # 編輯遊戲資料視窗
│   │   ├── filter/      
│   │   │   ├── CategoryNode.vue # 分類節點
│   │   │   ├── CategoryTree.vue # 分類樹（側邊選單）
│   │   │   └── Search.vue # 搜尋欄
│   │   └── common/      
│   │       ├── InlineLoading.vue # loading動畫
│   │       ├── Logo.vue # logo
│   │       └── Message.vue # 通知
│   ├── views/          
│   │   ├── Home.vue # 首頁
│   │   └── Login.vue # 登入畫面
│   ├── router/  
│   │   └── index.ts 
│   ├── stores/          
│   │   ├── authStore.ts # 使用者登入狀態
│   │   ├── gameStore.ts # 遊戲資料狀態
│   │   └── globalStore.ts # 全域 UI 狀態（message）
│   ├── types/  
│   │   └── game.ts # 遊戲資料型別
│   ├── services/        
│   │   └── firebase.ts
│   ├── main.ts
│   └── App.vue
├── public/ 
├── index.html
├── package.json
└── vite.config.ts
```

---

## 快速開始

### 環境要求

- Node.js >= 18  
- npm >= 8  

### 開啟專案

```bash
npm install
npm run dev
```

---

## 操作流程

1. 註冊 / 登入帳號
2. 點擊右下角「新增遊戲」按鈕，填寫名稱、圖片連結、進度、平台、分類、筆記、開始及完成時間
3. 點擊遊戲卡片右上角，開啟編輯畫面，可修改或刪除資料
4. 使用搜尋或分類篩選清單

