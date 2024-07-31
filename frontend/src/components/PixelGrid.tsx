import React, { useCallback } from 'react';
import Grid from '@mui/material/Grid';
import { PixelData } from '../types';
import { Pixel } from "./Pixel";

export const PixelGrid = React.memo(({ pixels, onPixelClick, setHoveredPixel }: {
  pixels: PixelData[][],
  onPixelClick: (x: number, y: number) => any,
  setHoveredPixel: React.Dispatch<React.SetStateAction<{
    data: PixelData;
    x: number;
    y: number;
  } | null>>
}) => {
  const handleMouseEnter = useCallback((pixelData: PixelData, x: number, y: number, e: React.MouseEvent) => {
    setHoveredPixel({ data: pixelData, x, y });
  }, [setHoveredPixel]);

  const handleMouseLeave = useCallback(() => {
    setHoveredPixel(null);
  }, [setHoveredPixel]);

  return (
    <div style={{ width: '80vw', height: '100vh', overflow: 'auto', overflowX: "hidden" }}>
      <Grid container spacing={0.01} sx={{ width: '100%', height: '100%' }}>
        {pixels.map((row, rowIndex) =>
          row.map((pixelData, colIndex) => (
            <Pixel
              x={rowIndex}
              y={colIndex}
              data={pixelData}
              key={`${rowIndex} - ${colIndex}`}
              onClick={onPixelClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            />
          )
          ))
        }
      </Grid>

    </div>
  );
});