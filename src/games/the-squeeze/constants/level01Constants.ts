import { LevelData } from "../editor/LevelEditorTypes"
import { generateLevelBoundaries } from "../helpers"

const WIDTH = 800
const HEIGHT = 600

export const LEVEL_01: LevelData = {
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
    pushBoxes: [
        { x: 545, y: 450, width: 90, height: 90, color: 'red', sizeToMove: 45 },
    ],
    movingPlatforms: [],
    exitDoors: [
        { x: 730, y: 530, width: 100, height: 100, color: 'yellow', doorPath: 'level-02' },
    ],
}
