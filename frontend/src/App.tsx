import React, { useEffect, useState, useRef, useCallback } from 'react';
import UsernameModal from './components/UsernameModal';
import PixelGrid from './components/PixelGrid';
import Chat from './components/Chat';
import { SketchPicker } from 'react-color';
import { api } from './services/api';
import { socket } from './utils/socket';
import { PixelData } from './types';
import { PixelInfoTooltip } from './components/PixelInfoTooltip';

const App = () => {
  const [username, setUsername] = useState<string>("");
  const [pixels, setPixels] = useState<PixelData[][]>([]);
  const pixelsRef = useRef(pixels); // Use a ref to hold the pixels state
  const [hoveredPixel, setHoveredPixel] = useState<{ data: PixelData, x: number, y: number } | null>(null);
  const [selectedPixel, setSelectedPixel] = useState<{ rowIndex: number, colIndex: number }>();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleStart = (username: string) => {
    api.sendJoinEvent(username);
    setUsername(username);
  };

  const handlePixelClick = useCallback((rowIndex: number, colIndex: number) => {
    setSelectedPixel({ rowIndex, colIndex });
    setShowColorPicker(true);
  }, []);

  const handleColorChange = (color: string) => {
    if (selectedPixel) {
      api.setPixelData({ x: selectedPixel.rowIndex, y: selectedPixel.colIndex, color, username });
    } else {
      console.log('No pixel is selected')
    }
    setShowColorPicker(false);
  };

  useEffect(() => {
    api.getPixels()
      .then(fetchedPixels => {
        setPixels(fetchedPixels);
        pixelsRef.current = fetchedPixels;
      }
      )

    // Handle pixel updates from the socket
    const handleSetPixel = ({ x, y, username, color }: any) => {
      // Check if indices are within bounds
      if (x < 0 || x >= pixelsRef.current.length || y < 0 || y >= (pixelsRef.current[0] ? pixelsRef.current[0].length : 0)) {
        console.error('Invalid pixel indices:', x, y);
        return;
      }

      // Create a new copy of the pixels array
      const newPixels = pixelsRef.current.map(row => row.slice());

      // Update the specific pixel
      newPixels[x][y] = { username, color, lastChangeTime: new Date() };
      setPixels(newPixels);
      pixelsRef.current = newPixels; // Update the ref as well
    };
    socket.on('setPixel', handleSetPixel);

    return () => {
      socket.removeListener('setPixel', handleSetPixel);
    }
  }, [])

  return (
    <div id='app-container' >
      {!username ? (
        <UsernameModal open={username.length === 0} onStart={handleStart} />
      ) : (
        <>
          <PixelGrid pixels={pixels} onPixelClick={handlePixelClick} setHoveredPixel={setHoveredPixel} />
          <Chat />
          {hoveredPixel && <PixelInfoTooltip data={{ x: hoveredPixel.x, y: hoveredPixel.y, ...hoveredPixel.data }} />}
        </>
      )}
      {(showColorPicker && selectedPixel) && (
        <div id='color-selector'>
          <SketchPicker
            width='15vw'
            color={pixels[selectedPixel.rowIndex][selectedPixel.colIndex]?.color}
            onChange={(e) => handleColorChange(e.hex)}
          />
        </div>
      )}
    </div>
  );
};

export default App;
