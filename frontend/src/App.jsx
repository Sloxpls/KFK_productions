import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { AudioProvider } from "./contexts/AudioContext";
import Login from "./components/Login/Login";
import SongsPage from "./components/SongsPage/SongsPage";
import UploadSong from "./components/UploadSong/UploadSong";
import UploadMedia from "./components/UploadMedia/UploadMedia";
import MediaGallery from "./components/MediaGallery/MediaGallery";
import Layout from "./components/Layout/Layout";
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import "./App.css";

function App() {
  return (
    <AuthProvider>
      <AudioProvider>
        <Router>
          <Routes>
            <Route
              path="/login"
              element={
                <PublicRoute>
                  <Login />
                </PublicRoute>
              }
            />
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
              <Route path="upload-media" element={<UploadMedia />} />
              <Route path="media-gallery" element={<MediaGallery />} />
            </Route>
            <Route path="*" element={<Navigate to="/site/songs" />} />
          </Routes>
        </Router>
      </AudioProvider>
    </AuthProvider>
  );
}

export default App;