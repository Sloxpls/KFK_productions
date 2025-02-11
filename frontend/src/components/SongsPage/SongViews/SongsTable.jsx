import { useState } from "react";
import PropTypes from "prop-types";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  TableSortLabel,
} from "@mui/material";

import EditTrack from "../EditTrack"
import useTrackStore from "../../../hooks/useTrackStore";
import { useAudioContext } from "../../../contexts/AudioContext";
import { useTrackFiltering } from "../../../hooks/useTrackFiltering";
import "./SongsTable.css";

const SongsTable = ({ tracks, searchTerm }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const { selectedTrack, setSelectedTrack } = useTrackStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTrack, setEditingTrack] = useState(null);
  const { isPlaying, togglePlayPause } = useAudioContext();
  const { filteredAndSortedTracks } = useTrackFiltering(tracks, searchTerm, sortConfig);

  const handlePlay = (track) => {
    if (selectedTrack?.id === track.id) {
      togglePlayPause();
    } else {
      setSelectedTrack(track);
      togglePlayPause();
    }
  };

  const handleEdit = (track) => {
    setEditingTrack({ ...track }); // Make a copy of the track data to avoid interfering with streaming
    setIsModalOpen(true);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }))
  }

  return (
    <div className={"songs-container"}>
      <TableContainer
        component={Paper}
        style={{ backgroundColor: "rgba(242, 242, 242, 0.3)" }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell></TableCell>
              <TableCell></TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'title'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('title')}
                >
                  Title
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'description'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('description')}
                >
                  Description
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'producer'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('producer')}
                >
                  Producer
                </TableSortLabel>
              </TableCell>
              <TableCell>
                <TableSortLabel
                  active={sortConfig.key === 'writer'}
                  direction={sortConfig.direction}
                  onClick={() => handleSort('writer')}
                >
                  Writer
                </TableSortLabel>
              </TableCell>
              <TableCell>Socials</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <Button id="playbtn" onClick={() => handlePlay(track)}>
                    {selectedTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
                  </Button>
                </TableCell>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`${track.img_path}`}
                      alt="Track"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                        marginLeft: "10px",
                      }}
                    />
                  </div>
                </TableCell>
                <TableCell>{track.title}</TableCell>
                <TableCell className="description-cell">{track.description}</TableCell>
                <TableCell>{track.producer}</TableCell>
                <TableCell>{track.writer}</TableCell>
                <TableCell>
                  {track.tiktok && "tiktok"}
                  {track.soundcloud && "soundcloud"}
                  {track.spotify && "spotify"}
                  {track.youtube && "youtube"}
                  {track.instagram && "instagram"}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(track)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <EditTrack
        open={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTimeout(() => setEditingTrack(null), 200);
        }}
        track={editingTrack}
      />
    </div>
  );
};

SongsTable.propTypes = {
  tracks: PropTypes.array.isRequired,
  searchTerm: PropTypes.string
};

export default SongsTable;