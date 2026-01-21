
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import Admin from './components/Admin';
import FloatingBackground from './components/FloatingBackground';
import AudioPlayer from './components/AudioPlayer';
import CustomCursor from './components/CustomCursor';

const App: React.FC = () => {
  return (
    <Router>
      <CustomCursor />
      <AudioPlayer />
      <FloatingBackground />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
    </Router>
  );
};

export default App;
