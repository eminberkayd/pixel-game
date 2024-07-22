import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import UsernameModal from './components/UsernameModal';
import Grid from './components/Grid';
import Chat from './components/Chat';
import { SketchPicker } from 'react-color';
import { api } from './services/api';
import { socket } from './utils/socket';
import { PixelData } from './types';

const AppWrapper = styled.div`
  display: flex;
  height: 100vh;
  overflow: hidden;
`;

const MainContent = styled.div`
  display: flex;
  flex: 1;
`;

const App = () => {
  const [username, setUsername] = useState<string>("");
  const [pixels, setPixels] = useState<PixelData[][]>([]);
  const [selectedPixel, setSelectedPixel] = useState<{ rowIndex: number, colIndex: number }>();
  const [showColorPicker, setShowColorPicker] = useState(false);

  const handleStart = (username: string) => {
    setUsername(username);
  };

  const handlePixelClick = (rowIndex: number, colIndex: number) => {
    setSelectedPixel({ rowIndex, colIndex });
    setShowColorPicker(true);
  };

  const handleColorChange = (color: any) => {
    if(selectedPixel){
      api.setPixelData({x: selectedPixel.rowIndex, y: selectedPixel.colIndex, color: color.hex, username});
    } else {
      console.log('No pixel is selected')
    }
    setShowColorPicker(false);
  };

  useEffect(() => {
    api.getPixels().then(pixels => setPixels(pixels))
    socket.on('pixelChange', ({x, y, username, color, lastChangeTime }) => {
      let newPixels = [...pixels];
      newPixels[x][y] = {username, color, lastChangeTime};
      setPixels(newPixels);
    })
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <AppWrapper>
      {!username ? (
        <UsernameModal onStart={handleStart} />
      ) : (
        <MainContent>
          <Grid pixels={pixels} onPixelClick={handlePixelClick} />
          <Chat username={username} />
        </MainContent>
      )}
      {(showColorPicker && selectedPixel) && (
        <div style={{ position: 'absolute', top: 20, right: 20 }}>
          <SketchPicker
            color={pixels[selectedPixel.rowIndex][selectedPixel.colIndex]?.color}
            onChange={handleColorChange}
          />
        </div>
      )}
    </AppWrapper>
  );
};

export default App;
