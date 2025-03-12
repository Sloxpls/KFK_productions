import PropTypes from "prop-types";
import { 
  FormControl, 
  FormGroup, 
  FormControlLabel,
  Checkbox,
  Button,
} from "@mui/material";

import ClearAllIcon from '@mui/icons-material/ClearAll';

const StatusFiltering = ({ 
  statusFilters, 
  onFilterChange, 
  onResetFilters,
  showResetButton = true
}) => {
  const statusColors = {
    1: '#4caf50', // Uploaded - Green
    2: '#ff9800', // Pending - Orange
    3: '#2196f3', // Ready - Blue
    4: '#9e9e9e'  // WIP - Gray
  };

  const statusLabels = {
    1: 'Uploaded',
    2: 'Pending',
    3: 'Ready',
    4: 'WIP'
  };

  const hasActiveFilters = Object.values(statusFilters).some(value => value);

  return (
    <div className="filters-container">
      <FormControl component="fieldset" className="status-filter-group">
        <FormGroup row>
          {Object.entries(statusFilters).map(([statusId, isChecked]) => (
            <FormControlLabel
              key={statusId}
              control={
                <Checkbox 
                  checked={isChecked} 
                  onChange={onFilterChange} 
                  name={statusId}
                  className={`status-${statusId}-checkbox`}
                  sx={{
                    color: statusColors[statusId],
                    '&.Mui-checked': {
                      color: statusColors[statusId],
                    },
                  }}
                />
              }
              label={statusLabels[statusId]}
              className="filter-label"
            />
          ))}
        </FormGroup>
      </FormControl>
      
      {showResetButton && hasActiveFilters && (
        <Button 
        variant="text" 
        size="small"
        onClick={onResetFilters}
        sx={{
          marginTop: '8px',
          color: '#90caf9',
          fontSize: '1rem',
          textTransform: 'none',
          padding: '2px 8px',
          minWidth: 'auto',
          opacity: 0.85,
          '&:hover': {
            opacity: 1,
            backgroundColor: 'rgba(144, 202, 249, 0.08)'
          }
        }}
        startIcon={<ClearAllIcon fontSize="small" />}
      >
        Clear filters
      </Button>
      )}
    </div>
  );
};

StatusFiltering.propTypes = {
  statusFilters: PropTypes.object.isRequired,
  onFilterChange: PropTypes.func.isRequired,
  onResetFilters: PropTypes.func.isRequired,
  showResetButton: PropTypes.bool
};

export default StatusFiltering;