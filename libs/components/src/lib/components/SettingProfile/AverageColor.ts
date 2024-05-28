import { FastAverageColor } from 'fast-average-color';

export const getColorAverageFromURL = async (url: string) => {
    const fac = new FastAverageColor();
    const color = await fac.getColorAsync(url);
    if(color.error) return '#323232';
    return color.hex;
}