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
import { useTheme, useMediaQuery } from "@mui/material";
import MobileSongsMinimal from "./MinimalView";

import EditTrack from "../EditTrack"
import useTrackStore from "../../../hooks/useTrackStore";
import { useAudioContext } from "../../../contexts/AudioContext";
import { useTrackFiltering } from "../../../hooks/useTrackFiltering";
import useTracks from "../../../hooks/useTracks";

import "./SongsTable.css";
import ConfirmDialog from "../../Common/ConfirmDialog";

const SongsTable = ({ tracks, searchTerm }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const { selectedTrack, setSelectedTrack } = useTrackStore();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [trackToDelete, setTrackToDelete] = useState(null);
  const [editingTrack, setEditingTrack] = useState(null);
  const { isPlaying, togglePlayPause } = useAudioContext();
  const { filteredAndSortedTracks } = useTrackFiltering(tracks || [], searchTerm, sortConfig);
  const { streamTrack, downloadTrack, deleteTrack } = useTracks();

  const handlePlay = (track) => {
    if (selectedTrack?.id === track.id) {
      togglePlayPause();
    } else {
      setSelectedTrack({
        ...track,
        song_path: streamTrack(track.id),
      });
      togglePlayPause();
    }
  };

  const handleEdit = (track) => {
    setEditingTrack({ ...track });
    setIsModalOpen(true);
  };

  const handleDeleteClick = (track) => {
    setTrackToDelete(track);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (trackToDelete) {
      deleteTrack(trackToDelete.id);
      setDeleteConfirmOpen(false);
      setTrackToDelete(null);
      closeModal();
    }
  };

  const closeModal = () => {
    setEditingTrack(null);
    setIsModalOpen(false);
  };

  const handleSort = (key) => {
    setSortConfig((prevConfig) => ({
      key,
      direction: prevConfig.key === key && prevConfig.direction === "asc" ? "desc" : "asc",
    }));
  };

  if (isMobile) {
    return (
      <MobileSongsMinimal
        tracks={filteredAndSortedTracks}
        selectedTrackId={selectedTrack?.id}
        isPlaying={isPlaying}
        onPlayPause={handlePlay}
      />
    );
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
              <TableCell>Download</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredAndSortedTracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <Button id="playbtn" onClick={() => handlePlay(track)}>
                    <img
                      src={
                        selectedTrack?.id === track.id && isPlaying
                          ? "/icons/pause.svg"
                          : "/icons/play.svg"
                      }
                      alt={selectedTrack?.id === track.id && isPlaying ? "Pause" : "Play"}
                      style={{ width: "20px", height: "20px" }}
                    />
                  </Button>
                </TableCell>
                {/*
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <img
                      src={`/api/tracks/${track.id}/image`}
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
                */}
                <TableCell>{track.title}</TableCell>
                {/* <TableCell className="description-cell">{track.description}</TableCell> */}
                <TableCell>{track.producer}</TableCell>
                <TableCell>{track.writer}</TableCell>
                <TableCell>
                  {['tiktok', 'soundcloud', 'spotify', 'youtube', 'instagram']
                    .filter(platform => track.social_platforms?.[platform] ?? track[platform])
                    .map(platform => (
                      <img
                        key={platform}
                        className="social-icon"
                        src={`/icons/${platform}.svg`}
                        alt={platform}
                      />
                  ))}
                </TableCell>
                <TableCell>
                  <Button onClick={() => downloadTrack(track.id, `${track.title}.mp3`)}>
                  <i className="fas fa-download"></i>
                  </Button>
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(track)}>
                  <i className="fas fa-edit"></i>
                  </Button>
                  <Button onClick={() => handleDeleteClick(track)}>
                  <i className="fas fa-trash-alt"></i>
                  </Button>
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
      <ConfirmDialog
        isOpen={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        onConfirm={handleDeleteConfirm}
        title="Delete Track"
        message="Are you sure you want to delete this track?"
      />
    </div>
  );
};

SongsTable.propTypes = {
  tracks: PropTypes.array.isRequired,
  searchTerm: PropTypes.string
};

export default SongsTable;