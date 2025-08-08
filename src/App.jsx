import { useState } from 'react';
import ReviewAssistant from './components/ReviewAssistant.jsx';
import Attendance from './components/Attendance.jsx';
import Payroll from './components/Payroll.jsx';
import { CssBaseline, Box, Typography, FormControl, InputLabel, Select, MenuItem } from '@mui/material';

// Swiper imports
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const App = () => {
  const [role, setRole] = useState('admin');

  const slides = [
        { title: 'Review Assistant', content: <ReviewAssistant /> },
        { title: 'Attendance', content: <Attendance /> },
        { title: 'Payroll Management', content: <Payroll /> },
      ];

  return (
    <>
      <CssBaseline />
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          p: 3,
          backgroundColor: '#f9f9f9',
        }}
      >
        <Box
          sx={{
            width: '100%',
            maxWidth: '900px',
            backgroundColor: '#fff',
            p: 3,
            borderRadius: '10px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
          }}
        >
        <Typography
          variant="h2"
          fontFamily="cursive"
          fontWeight="bolder"
          align="center"
          sx={{
            color: "#FFFFFF", 
            backgroundColor: "#4169E1", 
            borderRadius: '12px',
            padding: '12px 24px',
            boxShadow: '0px 4px 10px rgba(0,0,0,0.3)',
            letterSpacing: '2px',
            textAlign: 'center'
          }}
          gutterBottom
        >
          CREO Unified Platform
        </Typography>

          {/* Role selection */}
          <Box sx={{ textAlign: 'center', mb: 0, mt: 6 }}>
            <FormControl
              variant="outlined"
              size="small"
              sx={{
                minWidth: 200,
                borderRadius: '6px',
              }}
            >
              <InputLabel id="role-label">Select Role</InputLabel>
              <Select
                labelId="role-label"
                value={role}
                onChange={(e) => setRole(e.target.value)}
              >
                <MenuItem value="admin">Admin</MenuItem>
                <MenuItem value="employee">Manager</MenuItem>
              </Select>
            </FormControl>
          </Box>

          {/* Swiper Carousel */}
          <Swiper
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={30}
            style={{ paddingBottom: '2rem' }}
            preventClicks={false}
            preventClicksPropagation={false}
          >
            {slides.map((slide, idx) => (
              <SwiperSlide key={idx}>
                <Box sx={{ p: 2 }}>
                  <h2 className="main-title">{slide.title}</h2>
                  {slide.content}
                </Box>
              </SwiperSlide>
            ))}
          </Swiper>
        </Box>
      </Box>
    </>
  );
};

export default App;
