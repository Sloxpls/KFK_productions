import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout/Layout.jsx";
import Login from "./components/Login/Login.jsx";
import SongsPage from "./components/SongsPage/SongsPage.jsx";
import UploadMedia from "./components/UploadMedia.jsx";
import MediaGallery from './components/MediaGallery/MediaGallery.jsx';
// import Laboratory from './components/Laboratory';

import "./App.css";

function App() {
  const isLoggedIn = sessionStorage.getItem("logged_in");

  return (
    <Router>
      <Routes>
        {/* Login Route (No Layout) */}
        <Route path="/" element={<Login />} />

        {/* Protected Routes with Layout */}
        {isLoggedIn ? (
          <Route path="/site/*" element={<Layout />}>
            <Route path="songs" element={<SongsPage />} />
            <Route path="upload" element={<UploadMedia />} />
            <Route path="media" element={<MediaGallery />} />
            {/* <Route path="laboratory" element={<Laboratory />} /> */}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
