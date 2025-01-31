import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom"
import { AuthProvider } from "./contexts/AuthContext"
import Layout from "./components/Layout/Layout.jsx"
import Login from "./components/Login/Login.jsx"
import SongsPage from "./components/SongsPage/SongsPage.jsx"
import MediaGallery from "./components/MediaGallery/MediaGallery.jsx"
import UploadSong from "./components/UploadSong/UploadSong.jsx"
import PrivateRoute from "./components/PrivateRoute"

import "./App.css"

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route
            path="/site"
            element={
              <PrivateRoute>
                <Layout />
              </PrivateRoute>
            }
          >
            <Route path="songs" element={<SongsPage />} />
            <Route path="upload-song" element={<UploadSong />} />
            <Route path="media-gallery" element={<MediaGallery />} />
          </Route>
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

