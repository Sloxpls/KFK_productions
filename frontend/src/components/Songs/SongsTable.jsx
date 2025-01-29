import { useState, useEffect } from "react";
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
} from "@mui/material";

import "../../styles/SongsTable.css";

const SongsTable = ({ tracks, onTrackSelect}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const handlePlay = (track) => {
    onTrackSelect(track);
  };

  const handleEdit = (id) => {
    setIsEditing(true);
    console.log(`Editing row with ID: ${id}`);
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

      setIsEditing(false);
      console.log("Save successful.");
    } catch (error) {
      console.error("Error saving changes:", error);
      alert("An error occurred while saving changes.");
    }
  };

  if (errorMessage) {
    return <p>{errorMessage}</p>;
  }

  return (
    <div className={"container"}>
      <TableContainer component={Paper} style={{ backgroundColor: "rgba(242, 242, 242, 0.3)" }}>
        <Table>
          {/* <TableHead>
            <TableRow>
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Description</TableCell>
              <TableCell>Producer</TableCell>
              <TableCell>Writer</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead> */}
          <TableBody>
            {tracks.map((track) => (
              <TableRow key={track.id}>
                <TableCell>
                  <img
                    src={track.img_path}
                    alt="Track"
                    style={{ width: "50px", height: "50px", objectFit: "cover" }}
                  />
                </TableCell>
                <TableCell>
                  {isEditing ? (
                    <TextField defaultValue={track.title} size="small" variant="outlined" />
                  ) : (
                    track.title
                  )}
                </TableCell>
                <TableCell>{track.description}</TableCell>
                <TableCell>{track.producer}</TableCell>
                <TableCell>{track.writer}</TableCell>
                <TableCell>
                  <Button onClick={() => handlePlay(track)}>Play</Button>
                  <Button onClick={() => handleEdit(track.id)}>Edit</Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

SongsTable.propTypes = {
  tracks: PropTypes.array.isRequired,
  onTrackSelect: PropTypes.func.isRequired,
};

export default SongsTable;
