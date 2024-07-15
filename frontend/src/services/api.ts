import { PixelColor } from "../types";

class PeakselAPI {


    getPixels(): PixelColor[][] {
        return Array(2).fill(Array(2).fill('#ffffff'));
    }

}

// singleton
export const api = new PeakselAPI();
