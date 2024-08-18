import { generateLevelBoundaries } from "../helpers"

export const LEVEL_02_BOUNDARIES = generateLevelBoundaries({
    width: 800,
    height: 600,
    offset: 200,
}).map(x => {
    return {
        ...x,
        color: '#111'
    }
})

export const LEVEL_02_WALLS: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
}[] = [
    // middle wall
    '300 340 50 530 #000',

    // exit boundaries
    '700 230 200 50 #000',
    '700 400 200 50 #000',


].map(w => {
    const [x, y, width, height, color] = w.split(' ')
    return {
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width),
        height: parseInt(height),
        color,
    }
})

export const LEVEL_02_PUSH_BOXES: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    sizeToMove: number,
}[] = [
    // push box
    '463 315 262 220 red 60',
].map(w => {
    const [x, y, width, height, color, sizeToMove] = w.split(' ')
    return {
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width),
        height: parseInt(height),
        color,
        sizeToMove: sizeToMove ? +sizeToMove : (+width + +height)/4,
    }
})
