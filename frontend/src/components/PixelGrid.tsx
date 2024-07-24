import React, { useState } from 'react';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Tooltip from '@mui/material/Tooltip';
import { PixelData } from '../types';

const Pixel = ({ data, onClick, onMouseEnter, onMouseLeave }: { data: PixelData, onClick: () => any, onMouseEnter: (event: React.MouseEvent) => void, onMouseLeave: () => void }) => {
  return (
    <Grid item xs={12 / 100}>
      <Box
        sx={{
          position: 'relative',
          width: '100%',
          aspectRatio: '1',
          backgroundColor: data.color,
          border: '1px solid #ddd',
        }}
        onClick={onClick}
        onMouseEnter={onMouseEnter}
        onMouseLeave={onMouseLeave}
      />
    </Grid>
  );
};

const PixelGrid = ({ pixels, onPixelClick }: { pixels: PixelData[][], onPixelClick: (x: number, y: number) => any }) => {
  const [hoveredPixel, setHoveredPixel] = useState<{ data: PixelData, x: number, y: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number } | null>(null);

  const handleMouseEnter = (pixelData: PixelData, x: number, y: number, event: React.MouseEvent) => {
    setHoveredPixel({ data: pixelData, x, y });
    setTooltipPosition({ top: event.clientY, left: event.clientX });
  };

  const handleMouseLeave = () => {
    setHoveredPixel(null);
    setTooltipPosition(null);
  };

  return (
    <Box sx={{ width: '100vmin', height: '100vmin', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <Box sx={{ width: '100%', height: '100%', position: 'relative' }}>
        <Grid container spacing={0.01} sx={{ width: '100%', height: '100%' }}>
          {pixels.map((row, rowIndex) =>
            row.map((pixelData, colIndex) => (
              <Pixel
                data={pixelData}
                key={`${rowIndex} - ${colIndex}`}
                onClick={() => onPixelClick(rowIndex, colIndex)}
                onMouseEnter={(event) => handleMouseEnter(pixelData, rowIndex, colIndex, event)}
                onMouseLeave={handleMouseLeave}
              />
            )
            ))
          }
        </Grid>
        {hoveredPixel && tooltipPosition && (
          <Tooltip
            open
            title={`Pixel (${hoveredPixel.x}, ${hoveredPixel.y}): ${JSON.stringify(hoveredPixel.data)}`}
            placement="top"
            sx={{
              position: 'absolute',
              top: tooltipPosition.top,
              left: tooltipPosition.left,
              pointerEvents: 'none',
            }}
          >
            <div></div>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
};

export default PixelGrid;
