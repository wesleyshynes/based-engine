import { generateLevelBoundaries } from "../helpers"

export const LEVEL_03_BOUNDARIES = generateLevelBoundaries({
    width: 800,
    height: 600,
    offset: 200,
}).map(x => {
    return {
        ...x,
        color: '#111'
    }
})

export const LEVEL_03_WALLS: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
}[] = [
    // top block
    '322 73 645 146 #000',
    // big square
    '589 199 110 92 #000',
    // 2 left strips
    '200 276 290 50 #000',
    '200 419 290 50 #000',
    // 2 right strips
    '569 276 306 50 #000',
    '608 419 385 50 #000',
    // stopper
    '600 539 400 126 #000',


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

export const LEVEL_03_PUSH_BOXES: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    sizeToMove: number,
}[] = [
    // push box
    '381 345 66 174 red 25',
    // red herring push box
    '379 199 90 90 red',
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

export const LEVEL_03_EXIT_DOORS = [{
    x: 722,
    y: 82,
    width: 100,
    height: 100,
    color: 'yellow',
    doorPath: 'level-04'
}]

