import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Layout from "./components/Layout.jsx";
import Login from "./components/Login.jsx";
import SongsPage from "./components/Songs/SongsPage.jsx";
import UploadMedia from "./components/UploadMedia.jsx";
/*import Media from './components/Media';
import Laboratory from './components/Laboratory';*/

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
            {/*<Route path="media" element={<Media />} />
            <Route path="laboratory" element={<Laboratory />} />*/}
          </Route>
        ) : (
          <Route path="*" element={<Navigate to="/" />} />
        )}
      </Routes>
    </Router>
  );
}

export default App;
