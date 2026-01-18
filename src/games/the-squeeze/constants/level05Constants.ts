import { generateLevelBoundaries } from "../helpers"

export const LEVEL_05_WIDTH = 1600
export const LEVEL_05_HEIGHT = 1200

export const LEVEL_05_BOUNDARIES = generateLevelBoundaries({
    width: LEVEL_05_WIDTH,
    height: LEVEL_05_HEIGHT,
    offset: 200,
}).map(x => {
    return {
        ...x,
        color: '#111'
    }
})

export const LEVEL_05_WALLS: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
}[] = [
    // top blocks
    '105 407 208 814 #000',
    '535 156 346 312 #000',
    '1247 100 708 200 #000',
    // mid blocks
    '790 370 208 100 #000',
    '919 456 468 56 #000',
    '475 674 118 148 #000',
    '1008 647 738 94 #000',
    '720 730 160 46 #000',
    '1152 783 450 46 #000',
    // bottom blocks
    '56 1011 112 376 #000',
    '1053 848 1094 50 #000',
    '617 989 222 190 #000',
    '1247 989 706 190 #000',


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

export const LEVEL_05_PUSH_BOXES: {
    x: number,
    y: number,
    width: number,
    height: number,
    color: string,
    sizeToMove: number,
}[] = [
    // push box
    '430 371 90 90 red 40',
    '580 428 170 216 red 80',
    '1222 314 190 190 red 80',
    '1332 542 90 90 red 40',
    '1434 647 90 90 red 40',
    '308 615 190 374 red 80',
    '351 953 276 260 red 90',
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

export const LEVEL_05_MOVING_PLATFORMS = [
    {
        x: 285,
        y: 160,

        width: 126,
        height: 294,

        xDirection: 0,
        yDirection: 1,

        xSpeed: 0,
        ySpeed: 3,

        minX: 285,
        maxX: 285,

        minY: 160,
        maxY: 277,

        color: 'purple'
    },
    {
        x: 1317,
        y: 1141,

        width: 528,
        height: 78,

        xDirection: 1,
        yDirection: 0,

        xSpeed: 3,
        ySpeed: 0,

        minX: 665,
        maxX: 1317,

        minY: 1141,
        maxY: 1141,

        color: 'purple'
    },
]

export const LEVEL_05_EXIT_DOORS = [
    {
        x: 810,
        y: 988,
        width: 100,
        height: 100,
        color: 'yellow',
        doorPath: 'credits-screen'
    }
]
