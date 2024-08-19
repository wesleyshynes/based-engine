import { generateLevelBoundaries } from "../helpers"

export const LEVEL_04_BOUNDARIES = generateLevelBoundaries({
    width: 1200,
    height: 900,
    offset: 200,
}).map(x => {
    return {
        ...x,
        color: '#111'
    }
})

export const LEVEL_04_WALLS: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
}[] = [
    // top blocks
    '272 67 544 134 #000',
    '928 67 544 134 #000',
    '285 174 570 50 #000',
    '915 174 570 50 #000',
    // bottom blocks
    '272 450 544 300 #000',
    '928 450 544 300 #000',
    // bottom right block
    '1046 755 310 290 #000',

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

export const LEVEL_04_PUSH_BOXES: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    sizeToMove: number,
}[] = [
    // push box
    '600 252 95 95 red 40',
    '600 350 95 95 red 40',
    '600 450 95 95 red 40',
    '600 750 280 280 red 70',
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
