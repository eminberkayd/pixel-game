import React, { useEffect, useState } from 'react'
import { Pixel, PixelColor } from '../types'
import { api } from '../services/api'
import { socketHandler } from '../utils/socket'

export const PixelGrid = () => {
    const [pixelColors, setPixelColors] = useState<PixelColor[][]>([])

    const changePixelColor = (x: number, y: number, color: string = '#000000') => {
        const newPixelColors = [...pixelColors];
        newPixelColors[x][y] = color;
        setPixelColors(newPixelColors);
    }

    const handlePixelClick = (x: number, y: number, color: string = '#f2f1d2') => {
        socketHandler.triggerEvent('pixelColorUpdate', JSON.stringify({
            x,
            y,
            color
        }));
    }

    useEffect(() => {
        const data = api.getPixels();
        setPixelColors(data);

        socketHandler.addEventHandler('pixelColorUpdate', ({ x, y, color }: Pixel) => {
            changePixelColor(x, y, color);
        });

        return () => socketHandler.removeListeningEvent('pixelColorUpdate');
    }, []);

    return (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(1000, 1fr)' }}>
            {pixelColors.map((row, x) =>
                row.map((color, y) => (
                    <div
                        key={`${x}-${y}`}
                        onClick={() => handlePixelClick(x, y)}
                        style={{ width: '1px', height: '1px', backgroundColor: color }}
                    >
                        {x} {y}
                        </div>
                ))
            )}
        </div>
    );
}
