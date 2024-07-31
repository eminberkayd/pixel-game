import React, { useCallback } from 'react';
import { Grid, Box } from '@mui/material';
import { PixelData } from '../types';

export const Pixel = React.memo(({ x, y, data, onClick, onMouseEnter, onMouseLeave }: { data: PixelData, x: number, y: number, onClick: (x: number, y: number) => any, onMouseEnter: (data: PixelData, x: number, y: number, event: React.MouseEvent) => void, onMouseLeave: () => void }) => {
    const handleClick = useCallback(() => {
        onClick(x, y)
    }, [onClick, x, y])

    const handleMouseEnter = useCallback((e: React.MouseEvent) => {
        onMouseEnter(data, x, y, e);
    }, [data, onMouseEnter, x, y]);

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
                onClick={handleClick}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={onMouseLeave}
            />
        </Grid>
    );
});
