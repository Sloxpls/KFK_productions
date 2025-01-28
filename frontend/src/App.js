import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import Login from './components/Login';
import LogoutButton from './components/LogoutButton';

function App() {
  return (
    <Router>
      <Navbar>
        <LogoutButton />
      </Navbar>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<SongList />} />
          <Route path="/upload" element={<UploadForm />} />
          <Route path="/song/:id" element={<SongDetail />} />
          <Route path="/playlists" element={<Playlist />} />
        </Route>
      </Routes>
    </Router>
  );
}