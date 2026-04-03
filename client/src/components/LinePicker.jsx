import { Box, Typography, Button, Chip, Stack } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import RouteIcon from '@mui/icons-material/Route';

export default function LinePicker({ city, onSelect, onBack }) {
  return (
    <Box>
      <Button
        startIcon={<ArrowBackIcon />}
        onClick={onBack}
        sx={{ mb: 2, color: 'text.secondary' }}
      >
        All Cities
      </Button>

      <Typography variant="h5" sx={{ mb: 3 }}>
        <RouteIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        {city.name} &mdash; {city.system}
      </Typography>

      <Stack direction="row" flexWrap="wrap" gap={2}>
        {city.lines.map((line, i) => (
          <Chip
            key={line.name}
            label={line.name}
            onClick={() => onSelect(i)}
            sx={{
              bgcolor: line.color,
              color: line.textColor,
              fontSize: '1rem',
              fontWeight: 700,
              height: 48,
              px: 2,
              borderRadius: '24px',
              transition: 'all 0.2s',
              '&:hover': {
                transform: 'translateY(-3px)',
                boxShadow: `0 6px 20px ${line.color}55`,
                filter: 'brightness(1.15)',
              },
              '& .MuiChip-label': { px: 1.5 },
            }}
          />
        ))}
      </Stack>
    </Box>
  );
}
