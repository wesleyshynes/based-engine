import { LevelData } from "../editor/LevelEditorTypes"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 1600
const HEIGHT = 1200

export const LEVEL_05: LevelData = {
    name: 'Level 05',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'credits-screen',
    playerStart: { x: 800, y: 88 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        // top blocks
        { x: 105, y: 407, width: 208, height: 814, color: '#000' },
        { x: 535, y: 156, width: 346, height: 312, color: '#000' },
        { x: 1247, y: 100, width: 708, height: 200, color: '#000' },
        // mid blocks
        { x: 790, y: 370, width: 208, height: 100, color: '#000' },
        { x: 919, y: 456, width: 468, height: 56, color: '#000' },
        { x: 475, y: 674, width: 118, height: 148, color: '#000' },
        { x: 1008, y: 647, width: 738, height: 94, color: '#000' },
        { x: 720, y: 730, width: 160, height: 46, color: '#000' },
        { x: 1152, y: 783, width: 450, height: 46, color: '#000' },
        // bottom blocks
        { x: 56, y: 1011, width: 112, height: 376, color: '#000' },
        { x: 1053, y: 848, width: 1094, height: 50, color: '#000' },
        { x: 617, y: 989, width: 222, height: 190, color: '#000' },
        { x: 1247, y: 989, width: 706, height: 190, color: '#000' },
    ],
    pushBoxes: [
        { x: 430, y: 371, width: 90, height: 90, color: 'red', sizeToMove: 40 },
        { x: 580, y: 428, width: 170, height: 216, color: 'red', sizeToMove: 80 },
        { x: 1222, y: 314, width: 190, height: 190, color: 'red', sizeToMove: 80 },
        { x: 1332, y: 542, width: 90, height: 90, color: 'red', sizeToMove: 40 },
        { x: 1434, y: 647, width: 90, height: 90, color: 'red', sizeToMove: 40 },
        { x: 308, y: 615, width: 190, height: 374, color: 'red', sizeToMove: 80 },
        { x: 351, y: 953, width: 276, height: 260, color: 'red', sizeToMove: 90 },
    ],
    movingPlatforms: [
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
    ],
    exitDoors: [
        { x: 810, y: 988, width: 100, height: 100, color: 'yellow', doorPath: 'credits-screen' },
    ],
}
