import React from 'react'
import ReactDOM from 'react-dom/client'
import {
  createBrowserRouter,
  RouterProvider,
  RouteObject
} from "react-router-dom";
import AuthWithUserpool from './components/authWithUserpool';

import './index.css'
import "@cloudscape-design/global-styles/index.css"

import LandingPage from './pages/landing_page/index'
import AuditoTranslate from './pages/audio_translate/index'

// 議事録ページをインポート
import MeetingMinutes from './pages/meeting_minutes/index';

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


// 認証コンポーネントを使用
const router = createBrowserRouter([
  {
    path: "/",
    element: <AuthWithUserpool />,
    children: routes,
  },
]);

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <RouterProvider router={router} />
  </React.StrictMode>
);
