import { useState } from 'react';
import { Box, Typography, Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AudioPanel from './AudioPanel';

export default function StationView({ lineData, onBack }) {
  const [selectedIndex, setSelectedIndex] = useState(null);
  const { stations, color, line, city, system } = lineData;

  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        Back to Lines
      </Button>

      <Typography variant="h5" sx={{ mb: 1 }}>
        <Box
          component="span"
          sx={{
            display: 'inline-block',
            width: 16,
            height: 16,
            borderRadius: '50%',
            bgcolor: color,
            mr: 1.5,
            verticalAlign: 'middle',
          }}
        />
        {city} &mdash; {line}
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
        {system} &bull; {stations.length} stations &bull; Tap a station to hear announcements
      </Typography>

      {/* Horizontal line diagram */}
      <Box
        sx={{
          overflowX: 'auto',
          pb: 2,
          '&::-webkit-scrollbar': { height: 6 },
          '&::-webkit-scrollbar-track': { background: '#111' },
          '&::-webkit-scrollbar-thumb': { background: '#444', borderRadius: 3 },
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'flex-start', position: 'relative', minWidth: 'max-content', px: 2, pt: 4, pb: 1 }}>
          {/* Track line */}
          <Box
            sx={{
              position: 'absolute',
              top: '2.65rem',
              left: 16,
              right: 16,
              height: 5,
              bgcolor: color,
              borderRadius: 2,
              opacity: 0.85,
            }}
          />

          {stations.map((station, i) => {
            const isActive = selectedIndex === i;
            return (
              <Box
                key={i}
                onClick={() => setSelectedIndex(i)}
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 90,
                  flexShrink: 0,
                  cursor: 'pointer',
                  zIndex: 1,
                  '&:hover .station-dot': {
                    transform: 'scale(1.5)',
                    boxShadow: `0 0 14px ${color}aa`,
                    bgcolor: '#fff',
                  },
                  '&:hover .station-label': {
                    color: '#fff',
                  },
                }}
              >
                <Box
                  className="station-dot"
                  sx={{
                    width: 18,
                    height: 18,
                    borderRadius: '50%',
                    border: `3px solid ${color}`,
                    bgcolor: isActive ? '#fff' : 'background.default',
                    mb: 0.75,
                    transition: 'all 0.2s',
                    transform: isActive ? 'scale(1.5)' : 'scale(1)',
                    boxShadow: isActive ? `0 0 14px ${color}aa` : 'none',
                  }}
                />
                <Typography
                  className="station-label"
                  sx={{
                    fontSize: '0.65rem',
                    textAlign: 'center',
                    color: isActive ? '#fff' : 'text.secondary',
                    fontWeight: isActive ? 700 : 400,
                    lineHeight: 1.2,
                    maxWidth: 85,
                    wordWrap: 'break-word',
                    transition: 'all 0.2s',
                  }}
                >
                  {station}
                </Typography>
              </Box>
            );
          })}
        </Box>
      </Box>

      {/* Audio panel */}
      {selectedIndex !== null && (
        <AudioPanel
          station={stations[selectedIndex]}
          stationIndex={selectedIndex}
          stations={stations}
          lineName={line}
          systemName={system}
          lineColor={color}
        />
      )}
    </Box>
  );
}
