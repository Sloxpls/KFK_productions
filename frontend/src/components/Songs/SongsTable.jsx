import { useState, useEffect, useMemo } from "react";
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
  TextField,
  TableSortLabel,
} from "@mui/material";

import EditTrack from "./EditTrack";
import "../../styles/SongsTable.css";

const SongsTable = ({ tracks, onTrackSelect}) => {
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'asc' });
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedTrack, setSelectedTrack] = useState(null);


  const getComparator = (key, direction) => {
    return (a, b) => {
      const aValue = a[key]?.toLowerCase() || '';
      const bValue = b[key]?.toLowerCase() || '';
      if (aValue < bValue) {
        return direction === 'asc' ? -1 : 1;
      }
      if (aValue > bValue) {
        return direction === 'asc' ? 1 : -1;
      }
      return 0;
    };
  };

  const sortedTracks = useMemo(() => {
    return [...tracks].sort(getComparator(sortConfig.key, sortConfig.direction));
  }, [sortConfig, tracks]);

  const handlePlay = (track) => {
    onTrackSelect(track);
  };

  const handleEdit = (track) => {
    setSelectedTrack(track)
    setIsModalOpen(true);
    console.log(`Editing row with ID: ${track.id}`);
  };

  const handleSort = (column) => {
    if (sortConfig.key === column) {
      // Toggle direction if the same column is clicked
      setSortConfig((prevConfig) => ({
        key: column,
        direction: prevConfig.direction === 'asc' ? 'desc' : 'asc',
      }));
    } else {
      // If a different column is clicked, default to the opposite of the current direction
      setSortConfig({
        key: column,
        direction: sortConfig.direction === 'asc' ? 'desc' : 'asc',
      });
    }
  };

  const handleSave = async (id, tracksData) => {
    try {
      if (Object.keys(tracksData).length > 0) {
        const tracksResponse = await fetch(`/api/tracks/${id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(tracksData),
        });
        if (!tracksResponse.ok) {
          throw new Error("Failed to update tracks data.");
        }
      }
    }
    catch (error) {
      console.error("Error updating tracks data:", error);
    }
  };

  return (
    <div className={"container"}>
      <TableContainer component={Paper} style={{ backgroundColor: "rgba(242, 242, 242, 0.3)" }}>
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
            {sortedTracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <div style={{ display: "flex", alignItems: "center" }}>
                    <Button id='playbtn' onClick={() => handlePlay(track)}>PLAY</Button>
                    <img
                      src={track.img_path}
                      alt="Track"
                      style={{ width: "50px", height: "50px", objectFit: "cover", marginLeft: "10px" }}
                    />
                  </div>
                </TableCell>
                <TableCell>{track.title}</TableCell>
                <TableCell>{track.description}</TableCell>
                <TableCell>{track.producer}</TableCell>
                <TableCell>{track.writer}</TableCell>
                <TableCell>
                  {track.tiktok && 'tiktok'}
                  {track.soundcloud && 'soundcloud'}
                  {track.spotify && 'spotify'}
                  {track.youtube && 'youtube'}
                  {track.instagram && 'instagram'}
                </TableCell>
                <TableCell>
                  <Button onClick={() => handleEdit(track)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* <EditTrack
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        track={selectedTrack}
        onSave={handleSave}
      /> */}
    </div>
  );
};

SongsTable.propTypes = {
  tracks: PropTypes.array.isRequired,
  onTrackSelect: PropTypes.func.isRequired,
};

export default SongsTable;
