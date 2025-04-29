import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject
} from "react-router-dom";
import App from './App.tsx';

import './index.css'
import "@cloudscape-design/global-styles/index.css"

import LandingPage from './pages/landing_page/index.tsx'
import AuditoTranslate from './pages/audio_translate/index.tsx'

// 議事録ページをインポート
import MeetingMinutes from './pages/meeting_minutes/index.tsx';

// メインとなるルート定義
const routes: RouteObject[] = [
  {
    path: '/',
    element: <LandingPage/>
  },
  {
    path: '/audio_translate',
    element: <AuditoTranslate />,
  },
  {
    path: '/meeting_minutes',
    // 議事録生成ページの追加
    element: <MeetingMinutes />,
  },
  
].flatMap((r) => (r !== null ? [r] : []));

// React.lazy用のSuspenseラッパーを追加
import { Suspense } from 'react';

// 認証をバイパスして直接Appコンポーネントを使用
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);