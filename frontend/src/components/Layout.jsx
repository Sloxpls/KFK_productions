import Navbar from './Navbar.jsx';
import AudioPlayer from "./Songs/AudioPlayer.jsx";


const playlist = [
  {
    title: "Gammal Norrlands",
    artist: "Bennie",
    url: "/Gammal Norrlands.mp3",
    cover: "/assets/Benzo.jpg"
  }
];

const Layout = () => {
  return (
    <>
      <Navbar />
      <AudioPlayer playlist={playlist}></AudioPlayer>
    </>
  );
}

export default Layout;
