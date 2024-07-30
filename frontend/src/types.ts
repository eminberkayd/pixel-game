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

export interface IChatItem {
    isMessage: boolean,
    text?: string,
    username?: string,
    sentByCurrentUser?: boolean
}

export type PixelColor = string;