import PropTypes from "prop-types";
import { List, ListItem, IconButton, ListItemText } from "@mui/material";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import PauseIcon from "@mui/icons-material/Pause";

const MobileSongsMinimal = ({
  tracks,
  selectedTrackId,
  isPlaying,
  onPlayPause
}) => {
  return (
    <List disablePadding>
      {tracks.map((track) => {
        const isCurrent = track.id === selectedTrackId;
        return (
          <ListItem
            key={track.id}
            divider
            sx={{
              display: "flex",
              alignItems: "center",
              px: 2,
              py: 1,
            }}
          >
            <IconButton
              edge="start"
              onClick={() => onPlayPause(track)}
              size="small"
            >
              {isCurrent && isPlaying ? (
                <PauseIcon fontSize="small" />
              ) : (
                <PlayArrowIcon fontSize="small" />
              )}
            </IconButton>
            <ListItemText
              primary={track.title}
              primaryTypographyProps={{
                noWrap: true,
                sx: { ml: 1, fontSize: "1rem" }
              }}
            />
          </ListItem>
        );
      })}
    </List>
  );
};

MobileSongsMinimal.propTypes = {
  tracks: PropTypes.array.isRequired,
  selectedTrackId: PropTypes.number,
  isPlaying: PropTypes.bool,
  onPlayPause: PropTypes.func.isRequired,
};

export default MobileSongsMinimal;