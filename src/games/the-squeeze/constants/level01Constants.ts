import { generateLevelBoundaries } from "../helpers"

export const LEVEL_01_BOUNDARIES = generateLevelBoundaries({
    width: 800,
    height: 600,
    offset: 200,
}).map(x => {
    return {
        ...x,
        color: '#111'
    }
})

export const LEVEL_01_WALLS: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
}[] = [
    // jail cell
    '200 425 400 50 #000',
    // jail bars
    '375 25 50 50 #000',
    '375 125 50 50 #000',
    '375 225 50 50 #000',
    '375 325 50 50 #000',

    // escape covering
    '700 430 200 50 #000',
    '625 555 50 90 #000',

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

export const LEVEL_01_PUSH_BOXES: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    sizeToMove: number,
}[] = [
    // push box
    '545 450 90 90 red',
].map(w => {
    const [x, y, width, height, color] = w.split(' ')
    return {
        x: parseInt(x),
        y: parseInt(y),
        width: parseInt(width),
        height: parseInt(height),
        color,
        sizeToMove: (+width + +height)/4,
    }
})

export const LEVEL_01_EXIT_DOORS = [
    {
        x: 730,
        y: 530,
        width: 100,
        height: 100,
        color: 'yellow',
        doorPath: 'level-02',
    }
]
