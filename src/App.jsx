import { Navigate, Outlet, Route, Routes } from 'react-router-dom'
import { ToastProvider } from './components/Toast.jsx'
import Layout from './components/Layout.jsx'
import { useStore } from './store/store.jsx'

import Login from './pages/Login.jsx'
import Feed from './pages/Feed.jsx'
import PostDetail from './pages/PostDetail.jsx'
import IdeaPipeline from './pages/IdeaPipeline.jsx'
import TeamBoard from './pages/TeamBoard.jsx'
import CalendarPage from './pages/CalendarPage.jsx'
import MentorReview from './pages/MentorReview.jsx'
import AdminTagRequests from './pages/AdminTagRequests.jsx'
import ProfilePage from './pages/ProfilePage.jsx'
import Settings from './pages/Settings.jsx'

function RequireAuth() {
  const { isAuthed } = useStore()
  return isAuthed ? <Outlet /> : <Navigate to="/login" replace />
}

function RequireRole({ roles, children }) {
  const { currentUser } = useStore()
  return roles.includes(currentUser.role) ? children : <Navigate to="/" replace />
}

export default function App() {
  return (
    <ToastProvider>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<RequireAuth />}>
          <Route element={<Layout />}>
            <Route index element={<Feed />} />
            <Route path="post/:id" element={<PostDetail />} />
            <Route path="pipeline" element={<IdeaPipeline />} />
            <Route path="team" element={<TeamBoard />} />
            <Route path="calendar" element={<CalendarPage />} />
            <Route
              path="review"
              element={
                <RequireRole roles={['mentor', 'admin']}>
                  <MentorReview />
                </RequireRole>
              }
            />
            <Route
              path="tags"
              element={
                <RequireRole roles={['admin']}>
                  <AdminTagRequests />
                </RequireRole>
              }
            />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<Settings />} />
          </Route>
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </ToastProvider>
  )
}
