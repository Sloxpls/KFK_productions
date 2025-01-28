import { useState, useEffect } from "react";
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

const SongsTable = () => {
  const [songs, setSongs] = useState([]);
  const [errorMessage, setErrorMessage] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [songsResponse] = await Promise.all([
          fetch("/api/songs"),
        ]);

        if (!songsResponse.ok) {
          throw new Error(
            `Songs API responded with status ${songsResponse.status}: ${songsResponse.statusText}`
          );
        }

        const songsData = await songsResponse.json();

        setSongs(songsData);
      } catch (error) {
        console.error("Error fetching data:", error);
        setErrorMessage("An error occurred while fetching data.");
      }
    };

    fetchData();
  }, []);

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
      <TableContainer component={Paper} style={{
        backgroundColor: "rgba(242, 242, 242, 0.3)",
      }}>
        <Table>
          <TableHead>
            <TableRow >
              <TableCell>Image</TableCell>
              <TableCell>Title</TableCell>
              <TableCell>Genre</TableCell>
              <TableCell>Duration</TableCell>
              <TableCell>Audio</TableCell>
              <TableCell>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {songs.map((song) => {
              return (
                <TableRow key={song.track_id}>
                  <TableCell>
                    <img
                      src={`/api/images/${song.track_id}`}
                      alt="Track"
                      style={{
                        width: "50px",
                        height: "50px",
                        objectFit: "cover",
                      }}
                    />
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        defaultValue={song.title}
                        size="small"
                        variant="outlined"
                      />
                    ) : (
                      song.title
                    )}
                  </TableCell>

                  <TableCell>{song.song_genere}</TableCell>

                  <TableCell>{song.song_duration} sekunder</TableCell>

                  <TableCell>
                    <Button> ▶ </Button>
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <Button
                        variant="contained"
                        color="primary"
                        onClick={() => handleSave(song.track_id, {}, {})}
                      >
                        Save
                      </Button>
                    ) : (
                      <Button
                        variant="contained"
                        color="secondary"
                        onClick={() => handleEdit(song.track_id)}
                      >
                        Edit
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </div>
  );
};

export default SongsTable;
