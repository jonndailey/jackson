import { Box, Typography, Card, CardActionArea, CardContent, Grid } from '@mui/material';
import LocationCityIcon from '@mui/icons-material/LocationCity';

const cityIcons = {
  'Washington, D.C.': '\u{1F3DB}\u{FE0F}',
  'Chicago': '\u{1F32C}\u{FE0F}',
  'New York City': '\u{1F5FD}',
  'Atlanta': '\u{1F351}',
  'San Francisco': '\u{1F309}',
};

export default function CityPicker({ metros, onSelect }) {
  return (
    <Box>
      <Typography variant="h5" sx={{ mb: 3, color: 'text.secondary' }}>
        <LocationCityIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Select a City
      </Typography>
      <Grid container spacing={2}>
        {metros.map((city, i) => (
          <Grid size={{ xs: 12, sm: 6, md: 4 }} key={city.name}>
            <Card
              sx={{
                background: 'linear-gradient(145deg, #111827 0%, #1a2332 100%)',
                border: '1px solid',
                borderColor: 'divider',
                transition: 'all 0.3s',
                '&:hover': {
                  borderColor: 'primary.main',
                  transform: 'translateY(-4px)',
                  boxShadow: '0 8px 30px rgba(76, 201, 240, 0.15)',
                },
              }}
            >
              <CardActionArea onClick={() => onSelect(i)} sx={{ p: 1 }}>
                <CardContent sx={{ textAlign: 'center' }}>
                  <Typography variant="h3" sx={{ mb: 1 }}>
                    {cityIcons[city.name] || '\u{1F687}'}
                  </Typography>
                  <Typography variant="h6" sx={{ color: '#fff' }}>
                    {city.name}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {city.system}
                  </Typography>
                  <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                    {city.lines.length} line{city.lines.length > 1 ? 's' : ''}
                  </Typography>
                </CardContent>
              </CardActionArea>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
