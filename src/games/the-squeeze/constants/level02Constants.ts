import { generateLevelBoundaries } from "../helpers"

export const LEVEL_02_WIDTH = 800
export const LEVEL_02_HEIGHT = 600

export const LEVEL_02_BOUNDARIES = generateLevelBoundaries({
    width: LEVEL_02_WIDTH,
    height: LEVEL_02_HEIGHT,
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
    '300 300 50 502 #000',

    // exit boundaries
    '700 113 200 226 #000',
    '700 489 200 226 #000',


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

export const LEVEL_02_EXIT_DOORS = [{
    x: 730,
    y: 315,
    width: 100,
    height: 100,
    color: 'yellow',
    doorPath: 'level-03'
}]
