
import { SqueezeLevelData } from "../editor"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 800
const HEIGHT = 600

export const LEVEL_01: SqueezeLevelData = {
    name: 'Level 01',
    levelWidth: WIDTH,
    levelHeight: HEIGHT,
    nextLevel: 'level-02',
    playerStart: { x: 100, y: 100 },
    boundaries: generateLevelBoundaries({ width: WIDTH, height: HEIGHT, offset: 200 }).map(x => ({ ...x, color: '#111' })),
    walls: [
        // jail cell
        { x: 200, y: 425, width: 400, height: 50, color: '#000' },
        // jail bars
        { x: 375, y: 25, width: 50, height: 50, color: '#000' },
        { x: 375, y: 125, width: 50, height: 50, color: '#000' },
        { x: 375, y: 225, width: 50, height: 50, color: '#000' },
        { x: 375, y: 325, width: 50, height: 50, color: '#000' },
        // escape covering
        { x: 700, y: 430, width: 200, height: 50, color: '#000' },
        { x: 625, y: 555, width: 50, height: 90, color: '#000' },
    ],
    polygons: [
        // Triangle obstacle near the center
        {
            x: 550,
            y: 100,
            vertices: [
                { x: 0, y: -40 },
                { x: 35, y: 30 },
                { x: -35, y: 30 },
            ],
            angle: 0,
            color: '#222'
        },
    ],
    pushBoxes: [
        { x: 545, y: 450, width: 90, height: 90, color: 'red', sizeToMove: 45 },
    ],
    movingPlatforms: [],
    exitDoors: [
        { x: 730, y: 530, width: 100, height: 100, color: 'yellow', doorPath: 'level-02' },
    ],
    hazardBlocks: [
        { x: 300, y: 200, width: 80, height: 80 },
    ],
    levelTexts: [
        { x: 100, y: 50, text: 'The Squeeze - Level 01', fontSize: 24, color: '#fff', angle: 0, fontFamily: 'Arial', fontWeight: 'bold' },
    ],
    levelSensors: [
        { type: 'box', angle: 0, x: 545, y: 200, width: 100, height: 100 },
    ]
}
