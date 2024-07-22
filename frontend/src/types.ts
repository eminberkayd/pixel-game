export interface Pixel {
    x: number,
    y: number,
    color: PixelColor
}
export interface PixelData {
    color: string,
    username: string,
    lastChangeTime?: Date
}

export type PixelColor = string;