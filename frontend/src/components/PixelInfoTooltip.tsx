import React from 'react'
import { PixelData } from '../types'

export const PixelInfoTooltip = ({ data }: { data: PixelData & { x: number, y: number } }) => {
  return (
    <div id='pixel-info-tooltip'>
      <div>
        Pixel ({data.x}, {data.y})
      </div>
      <div style={{ backgroundColor: data.color, aspectRatio: 1, width: '2vw', margin: 'auto' }}></div>
      {data.username && data.lastChangeTime &&
        <p>Lastly colored by
          <strong>
            {' ' + data.username}
          </strong> at {new Date(data.lastChangeTime).toISOString()}</p>}
    </div>
  )
}
