import React from 'react';
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
`;

const PixelWrapper = styled(animated.div)`
  width: 100%;
  height: 100%;
  background-color: ${(props: any) => {
    return '#ffffff';
}};
  border: 1px solid #ddd;
`;

const Pixel = ({ color, onClick }: any) => {
  const props = useSpring({ backgroundColor: color });

  return <PixelWrapper style={props} onClick={onClick} />;
};

const Grid = ({ pixels, onPixelClick }: {pixels: PixelData[][], onPixelClick: (x: number, y: number) => any}) => {
  return (
    <GridWrapper>
      {pixels.map((row, rowIndex) =>
        row.map((color, colIndex) => (
          <Pixel
            key={`${rowIndex}-${colIndex}`}
            color={color}
            onClick={() => onPixelClick(rowIndex, colIndex)}
          />
        ))
      )}
    </GridWrapper>
  );
};

export default Grid;
