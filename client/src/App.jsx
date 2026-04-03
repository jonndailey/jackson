import { useState, useEffect } from 'react';
import { Container, Box, Typography, Fade } from '@mui/material';
import TrainIcon from '@mui/icons-material/Train';
import CityPicker from './components/CityPicker';
import LinePicker from './components/LinePicker';
import StationView from './components/StationView';

function App() {
  const [metros, setMetros] = useState([]);
  const [cityIndex, setCityIndex] = useState(null);
  const [lineData, setLineData] = useState(null);

  useEffect(() => {
    fetch('/api/metros')
      .then(r => r.json())
      .then(setMetros);
  }, []);

  const handleSelectCity = (index) => {
    setCityIndex(index);
    setLineData(null);
  };

  const handleSelectLine = async (lineIndex) => {
    const res = await fetch(`/api/metros/${cityIndex}/lines/${lineIndex}`);
    const data = await res.json();
    setLineData(data);
  };

  const handleBack = (to) => {
    if (to === 'cities') {
      setCityIndex(null);
      setLineData(null);
    } else if (to === 'lines') {
      setLineData(null);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', pb: 6 }}>
      <Container maxWidth="lg">
        <Box sx={{ textAlign: 'center', pt: 5, pb: 3 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5, mb: 1 }}>
            <TrainIcon sx={{ fontSize: 40, color: 'primary.main' }} />
            <Typography variant="h3" sx={{
              background: 'linear-gradient(135deg, #4cc9f0 0%, #f72585 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              METRO SOUNDBOARD
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary">
            Pick a city, choose a line, tap a station, hear the announcements.
          </Typography>
        </Box>

        {cityIndex === null && (
          <Fade in>
            <div>
              <CityPicker metros={metros} onSelect={handleSelectCity} />
            </div>
          </Fade>
        )}

        {cityIndex !== null && !lineData && (
          <Fade in>
            <div>
              <LinePicker
                city={metros[cityIndex]}
                onSelect={handleSelectLine}
                onBack={() => handleBack('cities')}
              />
            </div>
          </Fade>
        )}

        {lineData && (
          <Fade in>
            <div>
              <StationView
                lineData={lineData}
                onBack={() => handleBack('lines')}
              />
            </div>
          </Fade>
        )}
      </Container>
    </Box>
  );
}

export default App;
