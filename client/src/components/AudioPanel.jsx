import { useState, useCallback } from 'react';
import { Box, Typography, Button, Paper, Stack, Fade } from '@mui/material';
import NotificationsActiveIcon from '@mui/icons-material/NotificationsActive';
import PlaceIcon from '@mui/icons-material/Place';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
import WarningIcon from '@mui/icons-material/Warning';
import LastPageIcon from '@mui/icons-material/LastPage';
import SyncIcon from '@mui/icons-material/Sync';
import SwapHorizIcon from '@mui/icons-material/SwapHoriz';
import VolumeUpIcon from '@mui/icons-material/VolumeUp';

const synth = window.speechSynthesis;

function speak(text) {
  synth.cancel();
  return new Promise((resolve) => {
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 1.0;
    const voices = synth.getVoices();
    const preferred = voices.find(v =>
      v.lang.startsWith('en') && (v.name.includes('Google') || v.name.includes('Microsoft') || v.name.includes('Samantha'))
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];
    if (preferred) utterance.voice = preferred;
    utterance.onend = resolve;
    utterance.onerror = resolve;
    synth.speak(utterance);
  });
}

// Ensure voices are loaded
if (typeof speechSynthesis !== 'undefined') {
  speechSynthesis.onvoiceschanged = () => speechSynthesis.getVoices();
}

const TRANSFER_KEYWORDS = [
  'Center', 'Square', 'Junction', 'Plaza', 'Five Points', 'Metro Center',
  'Gallery', 'Clark/Lake', 'Times Sq', 'Grand Central', 'Embarcadero',
  'Howard', 'Lindbergh', "L'Enfant", 'Fort Totten', 'Rosslyn', 'MacArthur', '12th St',
];

export default function AudioPanel({ station, stationIndex, stations, lineName, systemName, lineColor }) {
  const [playingId, setPlayingId] = useState(null);

  const prevStation = stationIndex > 0 ? stations[stationIndex - 1] : null;
  const nextStation = stationIndex < stations.length - 1 ? stations[stationIndex + 1] : null;
  const isFirst = stationIndex === 0;
  const isLast = stationIndex === stations.length - 1;
  const isTransfer = TRANSFER_KEYWORDS.some(kw => station.includes(kw));

  const handlePlay = useCallback(async (id, text) => {
    setPlayingId(id);
    await speak(text);
    setPlayingId(null);
  }, []);

  const announcements = [
    {
      id: 'arriving',
      label: `Now arriving: ${station}`,
      text: `Now arriving... ${station}.`,
      icon: <NotificationsActiveIcon />,
      color: '#4cc9f0',
      bg: '#0c2d3f',
    },
    {
      id: 'now-at',
      label: `You are now at ${station}`,
      text: `You are now at ${station}. ${lineName}, ${systemName}.`,
      icon: <PlaceIcon />,
      color: '#72efdd',
      bg: '#0c2f1f',
    },
    ...(nextStation ? [{
      id: 'next',
      label: `Next station: ${nextStation}`,
      text: `Next station... ${nextStation}.`,
      icon: <ArrowForwardIcon />,
      color: '#f4a261',
      bg: '#2f1a00',
    }] : []),
    ...(prevStation ? [{
      id: 'prev',
      label: `Next station: ${prevStation}`,
      text: `Next station... ${prevStation}.`,
      icon: <ArrowBackIcon />,
      color: '#e9c46a',
      bg: '#2f2a00',
    }] : []),
    {
      id: 'doors-open',
      label: 'Doors opening',
      text: 'Doors opening. Please stand clear of the doors.',
      icon: <MeetingRoomIcon />,
      color: '#c77dff',
      bg: '#200030',
    },
    {
      id: 'doors-close',
      label: 'Doors closing',
      text: 'Step back. Doors closing. Please stand clear of the closing doors.',
      icon: <WarningIcon />,
      color: '#ff9f1c',
      bg: '#2f1500',
    },
    ...((isFirst || isLast) ? [
      {
        id: 'terminus',
        label: 'This is the last stop',
        text: `This is ${station}. This is the last stop on this train. All passengers must exit. Thank you for riding ${systemName}.`,
        icon: <LastPageIcon />,
        color: '#ef476f',
        bg: '#2f0010',
      },
      {
        id: 'service-to',
        label: `Service to ${isFirst ? stations[stations.length - 1] : stations[0]}`,
        text: `This train is now in service to ${isFirst ? stations[stations.length - 1] : stations[0]}. ${lineName}.`,
        icon: <SyncIcon />,
        color: '#06d6a0',
        bg: '#002f1a',
      },
    ] : []),
    ...(isTransfer ? [{
      id: 'transfer',
      label: 'Transfer available',
      text: `Transfer is available at ${station}. Please check station signage for connecting services.`,
      icon: <SwapHorizIcon />,
      color: '#ff6b6b',
      bg: '#2f0a0a',
    }] : []),
  ];

  return (
    <Fade in>
      <Paper
        elevation={0}
        sx={{
          mt: 3,
          p: 3,
          bgcolor: 'background.paper',
          border: '1px solid',
          borderColor: 'divider',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2.5 }}>
          <Box sx={{ width: 8, height: 32, borderRadius: 1, bgcolor: lineColor }} />
          <Typography variant="h6">{station}</Typography>
        </Box>

        <Stack direction="row" flexWrap="wrap" gap={1.5}>
          {announcements.map((a) => {
            const isPlaying = playingId === a.id;
            return (
              <Button
                key={a.id}
                variant="outlined"
                startIcon={isPlaying ? <VolumeUpIcon /> : a.icon}
                onClick={() => handlePlay(a.id, a.text)}
                sx={{
                  borderColor: `${a.color}66`,
                  color: a.color,
                  bgcolor: a.bg,
                  py: 1.2,
                  px: 2,
                  fontSize: '0.875rem',
                  animation: isPlaying ? 'pulse 0.8s ease-in-out infinite alternate' : 'none',
                  '@keyframes pulse': {
                    from: { boxShadow: `0 0 4px ${a.color}22` },
                    to: { boxShadow: `0 0 18px ${a.color}55` },
                  },
                  '&:hover': {
                    borderColor: a.color,
                    bgcolor: `${a.bg}cc`,
                    transform: 'translateY(-2px)',
                  },
                }}
              >
                {a.label}
              </Button>
            );
          })}
        </Stack>
      </Paper>
    </Fade>
  );
}
