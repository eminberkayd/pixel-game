import React, { useCallback, useState } from 'react';
import Grid from '@mui/material/Grid';
import Tooltip from '@mui/material/Tooltip';
import { PixelData } from '../types';
import { Pixel } from "./Pixel";

const PixelGrid = ({ pixels, onPixelClick }: { pixels: PixelData[][], onPixelClick: (x: number, y: number) => any }) => {
  const [hoveredPixel, setHoveredPixel] = useState<{ data: PixelData, x: number, y: number } | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ top: number, left: number } | null>(null);
  const handleMouseEnter = useCallback((pixelData: PixelData, x: number, y: number, e: React.MouseEvent) => {
    setHoveredPixel({ data: pixelData, x, y });
    setTooltipPosition({ top: e.clientY, left: e.clientX });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setHoveredPixel(null);
    setTooltipPosition(null);
  }, []);

  return (
    <div style={{ display: 'flex', flex: 4, justifyContent: 'center', alignItems: 'center' }}>
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
    </div>
  );
};

export default React.memo(PixelGrid);
