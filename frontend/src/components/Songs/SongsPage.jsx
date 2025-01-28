import AudioPlayer from "./AudioPlayer.jsx";
import SongsTable from "./SongsTable.jsx";

const playlist = [
  {
    title: "Benzo",
    artist: "Bennie",
    url: "/assets/Benzo.mp3",
    cover: "/assets/Benzo.jpg"
  }
];

const SongsPage = () => {
  return (
    <>
      <SongsTable></SongsTable>
      <AudioPlayer playlist={playlist}></AudioPlayer>

    </>
  );
}

export default SongsPage;