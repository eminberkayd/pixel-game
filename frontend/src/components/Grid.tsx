import React, { useState } from 'react';
import styled from 'styled-components';
import { useSpring, animated } from 'react-spring';
import { PixelData } from '../types';

const GridWrapper = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(20px, 1fr));
  grid-gap: 1px;
  width: 100%;
  max-width: 100%;
  height: 100vh;
  background-color: #f0f0f0;
  position: relative;
`;

const PixelWrapper = styled(animated.div)`
  width: 100%;
  height: 100%;
  background-color: ${(props: any) => {
    return '#ffffff';
  }};
  border: 1px solid #ddd;
  position: relative;
`;

const Tooltip = styled.div`
  position: absolute;
  background-color: #333;
  color: #fff;
  padding: 5px;
  border-radius: 3px;
  font-size: 12px;
  pointer-events: none;
  transform: translate(-50%, -100%);
  white-space: nowrap;
`;

const Pixel = ({ data, onClick, onMouseEnter, onMouseLeave }: {data: PixelData, onClick: () => any, onMouseEnter: (event: React.MouseEvent) => void, onMouseLeave: () => void}) => {
  const props = useSpring({ backgroundColor: data.color });

  return <PixelWrapper style={props} onClick={onClick} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave} />;
};

const Grid = ({ pixels, onPixelClick }: { pixels: PixelData[][], onPixelClick: (x: number, y: number) => any }) => {
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
    <GridWrapper>
      {pixels.map((row, rowIndex) =>
        row.map((pixelData, colIndex) => (
          <Pixel
            data={pixelData}
            key={`${rowIndex}-${colIndex}`}
            onClick={() => onPixelClick(rowIndex, colIndex)}
            onMouseEnter={(event) => handleMouseEnter(pixelData, rowIndex, colIndex, event)}
            onMouseLeave={handleMouseLeave}
          />
        ))
      )}
      {hoveredPixel && tooltipPosition && (
        <Tooltip style={{ top: tooltipPosition.top, left: tooltipPosition.left }}>
          {`Pixel (${hoveredPixel.x}, ${hoveredPixel.y}): ${JSON.stringify(hoveredPixel.data)}`}
        </Tooltip>
      )}
    </GridWrapper>
  );
};

export default Grid;
